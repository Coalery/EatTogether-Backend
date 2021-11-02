import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Resp } from 'src/common/response';
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
    return await this.partyRepository.findOne({ id });
  }

  async findNear500m(latitude: number, longitude: number): Promise<Party[]> {
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
      throw new HttpException(Resp.error(400), HttpStatus.BAD_REQUEST);
    }

    const result = this.partyRepository.create(party);
    return result;
  }

  async edit(user: User, partyId: number, data: EditPartyDto): Promise<Party> {
    let party: Party = await this.partyRepository.findOne(partyId);
    if (party.host.id !== user.id) {
      throw new HttpException(Resp.error(403), HttpStatus.FORBIDDEN);
    }

    party = { ...party, ...data };
    const erros = await validate(party);
    if (erros.length > 0) {
      throw new HttpException(Resp.error(400), HttpStatus.BAD_REQUEST);
    }

    return await this.partyRepository.save(data);
  }

  async delete(user: User, partyId: number): Promise<DeleteResult> {
    const party: Party = await this.partyRepository.findOne(partyId);
    if (party.host.id !== user.id) {
      throw new HttpException(Resp.error(403), HttpStatus.FORBIDDEN);
    }

    return await this.partyRepository.delete({ id: partyId });
  }
}
