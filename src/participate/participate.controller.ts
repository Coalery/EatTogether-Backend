import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ParticipateDto } from './participate.dto';
import { ParticipateService } from './participate.service';

@Controller('participate')
export class ParticipateController {
  constructor(private participateService: ParticipateService) {}

  @Post(':partyId')
  async participateToParty(
    @Req() req: Request,
    @Param('partyId', ParseIntPipe) partyId: number,
    @Body(ValidationPipe) data: ParticipateDto,
  ) {
    return this.participateService.participateToParty(
      partyId,
      req['user'],
      data.amount,
    );
  }

  @Delete(':partyId')
  async cancelParticipation(
    @Req() req: Request,
    @Param('partyId', ParseIntPipe) partyId: number,
  ) {
    await this.participateService.cancelParticipation(partyId, req['user']);
    return {};
  }
}
