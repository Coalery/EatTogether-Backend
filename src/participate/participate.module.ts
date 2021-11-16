import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyModule } from 'src/party/party.module';
import { UserModule } from 'src/user/user.module';
import { ParticipateController } from './participate.controller';
import { Participate } from './participate.entity';
import { ParticipateService } from './participate.service';

@Module({
  imports: [PartyModule, UserModule, TypeOrmModule.forFeature([Participate])],
  controllers: [ParticipateController],
  providers: [ParticipateService],
})
export class ParticipateModule {}
