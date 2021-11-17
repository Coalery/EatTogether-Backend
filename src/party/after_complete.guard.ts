import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Party } from './party.entity';
import { PartyService } from './party.service';

@Injectable()
export class AfterCompleteGuard implements CanActivate {
  constructor(private readonly partyService: PartyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const partyId: number = parseInt(req.params.partyId);

    if (!partyId) {
      throw new HttpException(
        'Validation failed (numeric string is expected)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const party: Party = await this.partyService.findOne(partyId);
    return party.state === 'gather-complete';
  }
}
