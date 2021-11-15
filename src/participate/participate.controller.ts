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
import { ParticipateService } from './participate.service';

@Controller('participate')
export class ParticipateController {
  constructor(private participateService: ParticipateService) {}

  @Post(':partyId')
  async participateToParty(
    @Req() req: Request,
    @Param('partyId', ParseIntPipe) partyId: number,
    @Body(ValidationPipe) data,
  ) {
    return this.participateService.participateToParty(
      partyId,
      req['user'],
      // data,
    );
  }

  @Delete(':partyId')
  async cancelParticipation(
    @Req() req: Request,
    @Param('partyId', ParseIntPipe) partyId: number,
  ) {
    return this.participateService.cancelParticipation(partyId, req['user']);
  }
}
