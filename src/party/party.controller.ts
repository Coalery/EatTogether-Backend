import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
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

  @Get(':id')
  async getParty(@Param('id', ParseIntPipe) id: number) {
    const party: EatParty = await this.partyService.findOne(id);
    if (!party) {
      throw new HttpException(Resp.error(404), HttpStatus.NOT_FOUND);
    }
    return Resp.ok(party);
  }

  @Post()
  async createParty(@Req() request: Request, @Body() data: CreatePartyDto) {
    const token: auth.DecodedIdToken = request['gfUser'];
    const user: User = await this.userService.findOne(token.uid);
    if (!user) {
      throw new HttpException(Resp.error(403), HttpStatus.FORBIDDEN);
    }

    const party: EatParty = await this.partyService.create(user, data);
    return Resp.ok(party);
  }
}
