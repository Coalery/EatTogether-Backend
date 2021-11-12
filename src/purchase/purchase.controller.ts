import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PurchaseCompleteDto, PurchaseWebhookDto } from './purchase.dto';
import { PurchaseGuard } from './purchase.guard';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @Post()
  async onPurchase(@Body() purchaseInfo: PurchaseCompleteDto) {
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
