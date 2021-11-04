import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Party } from 'src/party/party.entity';
import { User } from 'src/user/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ParticipateService {
  constructor(
    @InjectRepository(Party) private partyRepository: Repository<Party>,
  ) {}

  async participateToParty(
    partyId: number,
    requestor: User,
  ): Promise<UpdateResult> {
    const party: Party = await this.partyRepository.findOne(partyId);
    if (!party) {
      throw new HttpException(
        "Can't find party with given id.",
        HttpStatus.NOT_FOUND,
      );
    }

    const isParticipated =
      party.participant.filter((user) => user.id === requestor.id).length !== 0;
    if (isParticipated) {
      throw new HttpException(
        `User ${requestor.name} participated ${party.title} already.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.partyRepository.update(partyId, {
      participant: [...party.participant, requestor],
    });
  }

  async cancelParticipation(
    partyId: number,
    participant: User,
  ): Promise<UpdateResult> {
    const party: Party = await this.partyRepository.findOne(partyId);
    if (!party) {
      throw new HttpException(
        "Can't find party with given id.",
        HttpStatus.NOT_FOUND,
      );
    }

    const filteredParticipant: User[] = party.participant.filter(
      (user) => user.id !== participant.id,
    );

    const isParticipated =
      filteredParticipant.length !== party.participant.length;
    if (!isParticipated) {
      throw new HttpException(
        `User ${participant.name} didn't participate ${party.title}.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.partyRepository.update(partyId, {
      participant: filteredParticipant,
    });
  }
}
