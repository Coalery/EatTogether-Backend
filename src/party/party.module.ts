import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EatParty } from 'src/entity/eat_party.entity';
import { User } from 'src/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, EatParty]), UserModule],
  controllers: [PartyController],
  providers: [PartyService],
})
export class PartyModule {}
