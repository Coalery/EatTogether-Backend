import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from 'src/party/party.entity';
import { UserModule } from 'src/user/user.module';
import { AfterCompleteGuard } from './after_complete.guard';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';

@Module({
  imports: [TypeOrmModule.forFeature([Party]), UserModule],
  controllers: [PartyController],
  providers: [PartyService, AfterCompleteGuard],
  exports: [PartyService],
})
export class PartyModule {}
