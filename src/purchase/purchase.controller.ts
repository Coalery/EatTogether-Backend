import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PurchaseDto } from './purchase.dto';
import { PurchaseGuard } from './purchase.guard';

@Controller('purchase')
export class PurchaseController {
  @Post('webhook')
  @UseGuards(PurchaseGuard)
  purchaseWebhook(@Body() purchaseInfo: PurchaseDto) {
    console.log(purchaseInfo);
  }
}
