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

  @Put(':partyId/success')
  @UseGuards(AfterCompleteGuard, OnlyParticipantGuard)
  async setPartySuccess(@Param('partyId', ParseIntPipe) id: number) {
    // 모두가 성공을 동의했을 때 주최자에게 포인트가 가도록 변경해야함.
    // 지금은 호스트가 성공 처리하는 형태임
    // 수정 후에 API 명세도 수정해야함.
    const result: boolean = await this.partyService.partySuccess(id);
    return { result };
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
    // 서비스 내에 삭제 함수로 분리하여 참가자에게 포인트 돌려주는 로직 추가
    await this.partyService.edit(id, {
      removedAt: new Date(),
      state: 'canceled',
    });
    return {};
  }
}
