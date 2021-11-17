import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ParseFloatPipe } from 'src/common/parse_float.pipe';
import { Resp } from 'src/common/response';
import { Party } from 'src/party/party.entity';
import { User } from 'src/user/user.entity';
import { AfterCompleteGuard } from './after_complete.guard';
import { OnlyHostGuard } from './only_host.guard';
import { CreatePartyDto, EditPartyDto } from './party.dto';
import { PartyService } from './party.service';

@Controller('party')
export class PartyController {
  constructor(private partyService: PartyService) {}

  @Get()
  async getParties(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
  ) {
    return Resp.ok(await this.partyService.findNear500m(latitude, longitude));
  }

  @Get(':partyId')
  async getParty(@Param('partyId', ParseIntPipe) id: number) {
    const party: Party = await this.partyService.findOne(id);
    return Resp.ok(party);
  }

  @Post()
  async createParty(@Req() req: Request, @Body() data: CreatePartyDto) {
    const user: User = req['user'];
    const party: Party = await this.partyService.create(user, data);
    return Resp.ok(party);
  }

  @Put(':partyId')
  @UseGuards(OnlyHostGuard)
  async editParty(
    @Param('partyId', ParseIntPipe) id: number,
    @Body() data: EditPartyDto,
  ) {
    const result: Party = await this.partyService.edit(id, data);
    return Resp.ok(result);
  }

  @Put(':partyId/success')
  @UseGuards(AfterCompleteGuard, OnlyHostGuard)
  async setPartySuccess(@Param('partyId', ParseIntPipe) id: number) {
    const result: Party = await this.partyService.partySuccess(id);
    return Resp.ok(result);
  }

  @Delete(':partyId')
  @UseGuards(OnlyHostGuard)
  async deleteParty(@Param('partyId', ParseIntPipe) id: number) {
    const result: Party = await this.partyService.edit(id, {
      removedAt: new Date(),
      state: 'canceled',
    });
    return Resp.ok(result);
  }
}
