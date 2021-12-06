import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserDeco } from 'src/common/user.decorator';
import { AfterCompleteGuard } from 'src/party/after_complete.guard';
import { OnlyParticipantGuard } from 'src/party/only_participant.guard';
import { User } from 'src/user/user.entity';
import { ParticipateDto } from './participate.dto';
import { ParticipateService } from './participate.service';

@Controller('participate')
export class ParticipateController {
  constructor(private participateService: ParticipateService) {}

  @Post(':partyId')
  async participateToParty(
    @UserDeco() user: User,
    @Param('partyId', ParseIntPipe) partyId: number,
    @Body(ValidationPipe) data: ParticipateDto,
  ) {
    await this.participateService.participateToParty(
      partyId,
      user,
      data.amount,
    );
    return {};
  }

  @Put(':partyId/success')
  @UseGuards(AfterCompleteGuard, OnlyParticipantGuard)
  async agreeSuccess(
    @UserDeco() user: User,
    @Param('partyId', ParseIntPipe) partyId: number,
  ) {
    await this.participateService.agreeSuccess(partyId, user);
    return {};
  }

  @Delete(':partyId')
  async cancelParticipation(
    @UserDeco() user: User,
    @Param('partyId', ParseIntPipe) partyId: number,
  ) {
    await this.participateService.cancelParticipation(partyId, user);
    return {};
  }
}
