import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Party } from 'src/party/party.entity';
import { User } from 'src/user/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePartyDto, EditPartyDto } from './party.dto';

@Injectable()
export class PartyService {
  constructor(
    @InjectRepository(Party)
    private partyRepository: Repository<Party>,
  ) {}

  async findOne(id: number): Promise<Party | undefined> {
    const party: Party = await this.partyRepository.findOne({ id });
    if (!party) this.partyNotFound();
    return party;
  }

  async findNear500m(latitude: number, longitude: number): Promise<Party[]> {
    if (!this.validateLatitude(latitude)) {
      throw new HttpException(
        `Wrong Latitude Range : ${latitude}, Latitude must in [-90.0, 90.0]`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!this.validateLongitude(longitude)) {
      throw new HttpException(
        `Wrong Longitude Range : ${longitude}, Longitude must in [-180.0, 180.0]`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.partyRepository
      .createQueryBuilder()
      .having(
        `
          (
            (
              6371*acos(cos(radians(${latitude}))*cos(radians(meetLatitude))*cos(radians(meetLongitude)
              -radians(${longitude}))+sin(radians(${latitude}))*sin(radians(meetLatitude)))
            ) * 1000
          ) <= 500
        `,
      ) // (`latitude`, `logitude`)와 DB의 (`meetLatitude`, `meetLongitude`)의 거리를 계산하여, 500m 이하인 것만 가져온다.
      .orderBy('distance')
      .getMany();
  }

  private validateLatitude(latitude: number): boolean {
    return -90.0 <= latitude && latitude <= 90.0;
  }

  private validateLongitude(longitude: number): boolean {
    return -180.0 <= longitude && longitude <= 180.0;
  }

  async create(host: User, data: CreatePartyDto): Promise<Party> {
    const party: Party = new Party();
    party.title = data.title;
    party.description = data.description;
    party.restuarant = data.restuarant;
    party.host = host;
    party.meetLatitude = data.meetLatitude;
    party.meetLongitude = data.meetLongitude;
    party.goalPrice = data.goalPrice;
    party.participant = [];

    const errors = await validate(party);
    if (errors.length > 0) {
      throw new HttpException('Not valid data', HttpStatus.BAD_REQUEST);
    }

    const result = this.partyRepository.create(party);
    return result;
  }

  async edit(user: User, partyId: number, data: EditPartyDto): Promise<Party> {
    let party: Party = await this.partyRepository.findOne(partyId);

    if (!party) this.partyNotFound();
    if (party.host.id !== user.id) this.notOrganizer();

    party = { ...party, ...data };
    const erros = await validate(party);
    if (erros.length > 0) {
      throw new HttpException('Not valid data', HttpStatus.BAD_REQUEST);
    }

    return await this.partyRepository.save(data);
  }

  async delete(user: User, partyId: number): Promise<DeleteResult> {
    const party: Party = await this.partyRepository.findOne(partyId);

    if (!party) this.partyNotFound();
    if (party.host.id !== user.id) this.notOrganizer();

    return await this.partyRepository.delete({ id: partyId });
  }

  private partyNotFound(): void {
    throw new HttpException(
      "Can't find party by given id.",
      HttpStatus.NOT_FOUND,
    );
  }

  private notOrganizer(): void {
    throw new HttpException(
      'Party organizer only can delete party',
      HttpStatus.FORBIDDEN,
    );
  }
}
