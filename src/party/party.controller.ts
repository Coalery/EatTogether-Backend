import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Resp } from 'src/common/response';
import { EatParty } from 'src/party/eat_party.entity';
import { User } from 'src/user/user.entity';
import { DeleteResult } from 'typeorm';
import { CreatePartyDto } from './party.dto';
import { PartyService } from './party.service';

@Controller('party')
export class PartyController {
  constructor(private partyService: PartyService) {}

  @Get(':id')
  async getParty(@Param('id', ParseIntPipe) id: number) {
    const party: EatParty = await this.partyService.findOne(id);
    if (!party) {
      throw new HttpException(Resp.error(404), HttpStatus.NOT_FOUND);
    }
    return Resp.ok(party);
  }

  @Post()
  async createParty(@Req() req: Request, @Body() data: CreatePartyDto) {
    const user: User = req['user'];
    const party: EatParty = await this.partyService.create(user, data);
    return Resp.ok(party);
  }

  @Delete(':id')
  async deleteParty(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user: User = req['user'];
    const result: DeleteResult = await this.partyService.delete(user, id);
    return Resp.ok(result);
  }
}
