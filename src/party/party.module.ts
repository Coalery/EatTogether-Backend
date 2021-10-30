import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from 'src/party/party.entity';
import { User } from 'src/user/user.entity';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Party])],
  controllers: [PartyController],
  providers: [PartyService],
})
export class PartyModule {}
