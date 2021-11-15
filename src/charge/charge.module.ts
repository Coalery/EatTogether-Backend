import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Charge } from './charge.entity';
import { ChargeService } from './charge.service';

@Module({
  imports: [TypeOrmModule.forFeature([Charge])],
  providers: [ChargeService],
  exports: [ChargeService],
})
export class ChargeModule {}
