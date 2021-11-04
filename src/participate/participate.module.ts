import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from 'src/party/party.entity';
import { ParticipateController } from './participate.controller';
import { ParticipateService } from './participate.service';

@Module({
  imports: [TypeOrmModule.forFeature([Party])],
  controllers: [ParticipateController],
  providers: [ParticipateService],
})
export class ParticipateModule {}
