import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Resp } from 'src/common/response';
import { EatParty } from 'src/entity/eat_party.entity';
import { User } from 'src/entity/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePartyDto } from './create_party.dto';

@Injectable()
export class PartyService {
  constructor(
    @InjectRepository(EatParty)
    private partyRepository: Repository<EatParty>,
  ) {}

  async findOne(id: number): Promise<EatParty | undefined> {
    return await this.partyRepository.findOne({ id });
  }

  async create(host: User, data: CreatePartyDto): Promise<EatParty> {
    const party: EatParty = new EatParty();
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

  async delete(user: User, partyId: number): Promise<DeleteResult> {
    const party: EatParty = await this.partyRepository.findOne(partyId);
    if (party.host.id !== user.id) {
      throw new HttpException(Resp.error(403), HttpStatus.FORBIDDEN);
    }

    return await this.partyRepository.delete({ id: partyId });
  }
}
