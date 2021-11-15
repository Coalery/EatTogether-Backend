import { HttpModule, Module } from '@nestjs/common';
import { ChargeModule } from 'src/charge/charge.module';
import { OrderModule } from 'src/order/order.module';
import { PurchaseController } from './purchase.controller';
import { PurchaseGuard } from './purchase.guard';
import { PurchaseService } from './purchase.service';

@Module({
  imports: [HttpModule, OrderModule, ChargeModule],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseGuard],
})
export class PurchaseModule {}
