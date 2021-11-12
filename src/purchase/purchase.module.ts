import { HttpModule, Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseGuard } from './purchase.guard';
import { PurchaseService } from './purchase.service';

@Module({
  imports: [HttpModule],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseGuard],
})
export class PurchaseModule {}
