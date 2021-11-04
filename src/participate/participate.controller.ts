import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Req,
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
  ) {
    return this.participateService.participateToParty(partyId, req['user']);
  }

  @Delete(':partyId')
  async cancelParticipation(
    @Req() req: Request,
    @Param('partyId', ParseIntPipe) partyId: number,
  ) {
    return this.participateService.cancelParticipation(partyId, req['user']);
  }
}
