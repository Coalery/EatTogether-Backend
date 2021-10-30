import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EatParty } from 'src/party/eat_party.entity';
import { User } from 'src/user/user.entity';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, EatParty])],
  controllers: [PartyController],
  providers: [PartyService],
})
export class PartyModule {}
