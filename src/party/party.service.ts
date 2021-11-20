import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { validate } from 'class-validator';
import { Participate } from 'src/participate/participate.entity';
import { Party } from 'src/party/party.entity';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreatePartyDto, EditPartyDto } from './party.dto';

const message = {
  'ordered-food': '음식을 주문했습니다.',
  'deliverer-picked-up': '배달원이 픽업했습니다.',
  'come-out': '빨리 나와주세요!',
};

export type MessageType = keyof typeof message;

@Injectable()
export class PartyService {
  constructor(
    @InjectRepository(Party) private partyRepository: Repository<Party>,
    private userService: UserService,
  ) {}

  async findOne(id: number): Promise<Party> {
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
    party.participate = [];

    const errors = await validate(party);
    if (errors.length > 0) {
      throw new HttpException('Not valid data', HttpStatus.BAD_REQUEST);
    }

    const result = this.partyRepository.create(party);
    return result;
  }

  async edit(partyId: number, data: EditPartyDto): Promise<Party> {
    let party: Party = await this.partyRepository.findOne(partyId);

    if (!party) this.partyNotFound();
    if (party.state === 'success') this.alreadySuccessed();

    party = { ...party, ...data };
    const errors = await validate(party);
    if (errors.length > 0) {
      throw new HttpException('Not valid data', HttpStatus.BAD_REQUEST);
    }

    return await this.partyRepository.save(data);
  }

  async partySuccess(partyId: number): Promise<Party> {
    const party: Party = await this.edit(partyId, { state: 'success' });
    const sumOfPoint: number = party.participate.reduce(
      (acc, obj) => acc + obj.amount,
      0,
    );
    await this.userService.editAmount(party.host.id, sumOfPoint);
    return party;
  }

  async participate(partyId: number, participate: Participate): Promise<Party> {
    const party: Party = await this.partyRepository.findOne(partyId);
    party.participate.push(participate);
    return await this.partyRepository.save(party);
  }

  async sendMessage(
    sender: User,
    partyId: number,
    type: MessageType,
  ): Promise<number> {
    const party: Party = await this.findOne(partyId);

    if (type === 'ordered-food' || type === 'deliverer-picked-up') {
      return await this.onlyHostMessage(sender, party, type);
    } else {
      return await this.participantMessage(sender, party, type);
    }
  }

  private async onlyHostMessage(sender: User, party: Party, type: MessageType) {
    if (party.host.id !== sender.id) {
      throw new HttpException(
        'Party organizer only can delete party',
        HttpStatus.FORBIDDEN,
      );
    }

    if (
      (type === 'ordered-food' && party.usedFirstMessage) ||
      (type === 'deliverer-picked-up' && party.usedSecondMessage)
    ) {
      throw new HttpException(
        `Party organizer used message "{type}" already.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (type === 'ordered-food') party.usedFirstMessage = true;
    else if (type === 'deliverer-picked-up') party.usedSecondMessage = true;
    await this.partyRepository.save(party);

    const tokens: string[] = party.participate.map(
      (part) => part.participant.fcmToken,
    );
    return this.requestFCM(sender.name, type, tokens);
  }

  private async participantMessage(
    sender: User,
    party: Party,
    type: MessageType,
  ) {
    const current: Date = new Date();

    if (party.otherMessageUsedDate) {
      const millisecDiff: number =
        current.getTime() - party.otherMessageUsedDate.getTime();

      if (millisecDiff < 30 * 1000) {
        throw new HttpException(`${millisecDiff}`, HttpStatus.BAD_REQUEST);
      }
    }

    party.otherMessageUsedDate = current;
    await this.partyRepository.save(party);

    const tokens: string[] = [
      ...party.host.fcmToken,
      ...party.participate.map((part) => part.participant.fcmToken),
    ];
    tokens.splice(tokens.indexOf(sender.fcmToken), 1);
    return this.requestFCM(sender.name, type, tokens);
  }

  private async requestFCM(
    senderName: string,
    type: MessageType,
    tokens: string[],
  ): Promise<number> {
    const resp = await admin.messaging().sendMulticast({
      notification: {
        title: `${senderName}님이 메세지를 보냈습니다!`,
        body: message[type],
      },
      data: { type },
      tokens: tokens,
    });
    return resp.failureCount;
  }

  private partyNotFound(): void {
    throw new HttpException(
      "Can't find party by given id.",
      HttpStatus.NOT_FOUND,
    );
  }

  private alreadySuccessed(): void {
    throw new HttpException(
      "The party is already successed. You can't edit.",
      HttpStatus.BAD_REQUEST,
    );
  }
}
