import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { auth } from 'firebase-admin';
import { Resp } from 'src/common/response';
import { EatParty } from 'src/entity/eat_party.entity';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { CreatePartyDto } from './create_party.dto';
import { PartyService } from './party.service';

@Controller('party')
export class PartyController {
  constructor(
    private userService: UserService,
    private partyService: PartyService,
  ) {}

  @Post()
  async createParty(@Req() request: Request, @Body() data: CreatePartyDto) {
    const token: auth.DecodedIdToken = request['gfUser'];
    const user: User = await this.userService.findOne(token.uid);
    const party: EatParty = await this.partyService.create(user, data);
    return Resp.ok(party);
  }
}