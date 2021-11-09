import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { getClientIp } from 'request-ip';
import { Observable } from 'rxjs';

@Injectable()
export class PurchaseGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const ip: string = getClientIp(request);

    // 아임포트 웹훅 아이피
    return ip === '52.78.100.19' || ip === '52.78.48.223';
  }
}
