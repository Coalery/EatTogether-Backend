import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from 'src/party/party.entity';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';

@Module({
  imports: [TypeOrmModule.forFeature([Party])],
  controllers: [PartyController],
  providers: [PartyService],
  exports: [PartyService],
})
export class PartyModule {}
