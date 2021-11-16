import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Party } from 'src/party/party.entity';
import { User } from 'src/user/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Participate } from './participate.entity';

@Injectable()
export class ParticipateService {
  constructor(
    @InjectRepository(Party) private partyRepository: Repository<Party>,
  ) {}

  async participateToParty(
    partyId: number,
    requestor: User,
    amount: number,
  ): Promise<UpdateResult> {
    const party: Party = await this.partyRepository.findOne(partyId);
    if (!party) {
      throw new HttpException(
        "Can't find party with given id.",
        HttpStatus.NOT_FOUND,
      );
    }

    const isParticipated =
      party.participate.filter((part) => part.participant.id === requestor.id)
        .length !== 0;
    if (isParticipated) {
      throw new HttpException(
        `User ${requestor.name} participated ${party.title} already.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const participation: Participate = new Participate();
    participation.amount = amount;
    participation.party = party;
    participation.participant = requestor;

    return await this.partyRepository.update(partyId, {
      participate: [...party.participate, participation],
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

    const filteredParticipant: Participate[] = party.participate.filter(
      (part) => part.participant.id !== participant.id,
    );

    const isParticipated =
      filteredParticipant.length !== party.participate.length;
    if (!isParticipated) {
      throw new HttpException(
        `User ${participant.name} didn't participate ${party.title}.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.partyRepository.update(partyId, {
      participate: filteredParticipant,
    });
  }
}
