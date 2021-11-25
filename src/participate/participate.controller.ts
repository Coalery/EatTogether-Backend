import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserDeco } from 'src/common/user.decorator';
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
    return this.participateService.participateToParty(
      partyId,
      user,
      data.amount,
    );
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
