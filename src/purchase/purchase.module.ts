import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { PurchaseController } from './purchase.controller';
import { Purchase } from './purchase.entity';
import { PurchaseGuard } from './purchase.guard';
import { PurchaseService } from './purchase.service';

@Module({
  imports: [HttpModule, UserModule, TypeOrmModule.forFeature([Purchase])],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseGuard],
})
export class PurchaseModule {}
