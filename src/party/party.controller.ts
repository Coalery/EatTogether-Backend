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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ParseFloatPipe } from 'src/common/parse_float.pipe';
import { UserDeco } from 'src/common/user.decorator';
import { User } from 'src/user/user.entity';
import { AfterCompleteGuard } from './after_complete.guard';
import { OnlyHostGuard } from './only_host.guard';
import { OnlyParticipantGuard } from './only_participant.guard';
import { CreatePartyDto, EditPartyDto } from './party.dto';
import { MessageType, PartyService } from './party.service';

@Controller('party')
export class PartyController {
  constructor(private partyService: PartyService) {}

  @Get()
  async getParties(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
  ) {
    return await this.partyService.findNear500m(latitude, longitude);
  }

  @Get(':partyId')
  async getParty(@Param('partyId', ParseIntPipe) id: number) {
    return await this.partyService.findOne(id);
  }

  @Post()
  async createParty(
    @UserDeco() user: User,
    @Body(ValidationPipe) data: CreatePartyDto,
  ) {
    return await this.partyService.create(user, data);
  }

  @Put(':partyId')
  @UseGuards(OnlyHostGuard)
  async editParty(
    @Param('partyId', ParseIntPipe) id: number,
    @Body() data: EditPartyDto,
  ) {
    return await this.partyService.edit(id, data);
  }

  @Put(':partyId/cancel')
  @UseGuards(OnlyHostGuard)
  async cancelParty(@Param('partyId', ParseIntPipe) id: number) {
    await this.partyService.edit(id, {
      state: 'canceled',
    });
    return {};
  }

  @Put(':partyId/message/:msgType')
  @UseGuards(AfterCompleteGuard, OnlyParticipantGuard)
  async sendMessage(
    @UserDeco() user: User,
    @Param('partyId', ParseIntPipe) partyId: number,
    @Param('msgType') msgType: MessageType,
  ) {
    const result: number = await this.partyService.sendMessage(
      user,
      partyId,
      msgType,
    );
    return { failCount: result };
  }

  @Delete(':partyId')
  @UseGuards(OnlyHostGuard)
  async deleteParty(@Param('partyId', ParseIntPipe) id: number) {
    await this.partyService.deleteParty(id);
    return {};
  }
}
