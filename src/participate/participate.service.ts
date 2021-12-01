import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Party } from 'src/party/party.entity';
import { PartyService } from 'src/party/party.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Participate } from './participate.entity';

@Injectable()
export class ParticipateService {
  constructor(
    @InjectRepository(Participate)
    private participateRepository: Repository<Participate>,
    private partyService: PartyService,
    private userService: UserService,
  ) {}

  async participateToParty(
    partyId: number,
    requestor: User,
    amount: number,
  ): Promise<Party> {
    const party: Party = await this.partyService.findOne(partyId);

    const isParticipated =
      party.participate.filter((part) => part.participant.id === requestor.id)
        .length !== 0;
    if (isParticipated) {
      throw new HttpException(
        {
          type: 'already-participated',
          reason: `User ${requestor.name} participated '${party.title}' already.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userService.editAmount(requestor.id, -amount);
    const participate: Participate = this.createNewParticipate(
      amount,
      party,
      requestor,
    );

    return await this.partyService.participate(partyId, participate);
  }

  private createNewParticipate(
    amount: number,
    party: Party,
    requestor: User,
  ): Participate {
    const rawParticipate: Participate = new Participate();
    rawParticipate.amount = amount;
    rawParticipate.party = party;
    rawParticipate.participant = requestor;

    const participate: Participate =
      this.participateRepository.create(rawParticipate);

    return participate;
  }

  async cancelParticipation(
    partyId: number,
    participant: User,
  ): Promise<boolean> {
    const party: Party = await this.partyService.findOne(partyId);

    const targetPart: Participate = party.participate.find(
      (part) => part.participant.id === participant.id,
    );

    if (!targetPart) {
      throw new HttpException(
        {
          type: 'not-participated',
          reason: `User ${participant.name} didn't participate '${party.title}'.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userService.editAmount(participant.id, targetPart.amount);
    await this.participateRepository.remove(targetPart);
    return true;
  }
}
