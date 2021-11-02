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
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ParseFloatPipe } from 'src/common/parse_float.pipe';
import { Resp } from 'src/common/response';
import { Party } from 'src/party/party.entity';
import { User } from 'src/user/user.entity';
import { DeleteResult } from 'typeorm';
import { CreatePartyDto, EditPartyDto } from './party.dto';
import { PartyService } from './party.service';

@Controller('party')
export class PartyController {
  constructor(private partyService: PartyService) {}

  @Get()
  async getParties(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
  ) {}

  @Get(':id')
  async getParty(@Param('id', ParseIntPipe) id: number) {
    const party: Party = await this.partyService.findOne(id);
    if (!party) {
      throw new HttpException(Resp.error(404), HttpStatus.NOT_FOUND);
    }
    return Resp.ok(party);
  }

  @Post()
  async createParty(@Req() req: Request, @Body() data: CreatePartyDto) {
    const user: User = req['user'];
    const party: Party = await this.partyService.create(user, data);
    return Resp.ok(party);
  }

  @Put(':id')
  async editParty(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: EditPartyDto,
  ) {
    const user: User = req['user'];
    const result: Party = await this.partyService.edit(user, id, data);
    return Resp.ok(result);
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
