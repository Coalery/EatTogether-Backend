import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserDeco } from 'src/common/user.decorator';
import { User } from 'src/user/user.entity';
import { PurchaseRequestDto, PurchaseWebhookDto } from './purchase.dto';
import { PurchaseGuard } from './purchase.guard';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @Post('request')
  async onRequest(
    @UserDeco() user: User,
    @Body(ValidationPipe) data: PurchaseRequestDto,
  ) {
    await this.purchaseService.onRequest(user, data.merchant_uid, data.amount);
    return {};
  }

  @Post('webhook')
  @UseGuards(PurchaseGuard)
  async purchaseWebhook(@Body() purchaseInfo: PurchaseWebhookDto) {
    const { imp_uid, merchant_uid } = purchaseInfo;
    await this.purchaseService.onComplete(imp_uid, merchant_uid);
    return {};
  }
}
