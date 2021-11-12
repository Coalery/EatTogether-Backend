import { HttpModule, Module } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';
import { PurchaseController } from './purchase.controller';
import { PurchaseGuard } from './purchase.guard';
import { PurchaseService } from './purchase.service';

@Module({
  imports: [HttpModule, OrderModule],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseGuard],
})
export class PurchaseModule {}
