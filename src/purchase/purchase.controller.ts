import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import {
  PurchaseCompleteDto,
  PurchaseRequestDto,
  PurchaseWebhookDto,
} from './purchase.dto';
import { PurchaseGuard } from './purchase.guard';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @Post('request')
  async onRequest(
    @Req() req: Request,
    @Body(ValidationPipe) data: PurchaseRequestDto,
  ) {
    return await this.purchaseService.onRequest(
      req['user'],
      data.merchant_uid,
      data.amount,
    );
  }

  @Post('complete')
  async onComplete(@Body() purchaseInfo: PurchaseCompleteDto) {
    const { imp_uid, merchant_uid } = purchaseInfo;
    return await this.purchaseService.onComplete(imp_uid, merchant_uid);
  }

  @Post('webhook')
  @UseGuards(PurchaseGuard)
  async purchaseWebhook(@Body() purchaseInfo: PurchaseWebhookDto) {
    const { imp_uid, merchant_uid } = purchaseInfo;
    return await this.purchaseService.onComplete(imp_uid, merchant_uid);
  }
}
