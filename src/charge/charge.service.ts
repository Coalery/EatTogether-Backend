import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Charge } from './charge.entity';

@Injectable()
export class ChargeService {
  constructor(
    @InjectRepository(Charge) private chargeRepository: Repository<Charge>,
  ) {}

  async findOne(id: string): Promise<Charge> {
    return await this.chargeRepository.findOne(id);
  }

  async updateAmount(id: string, amount: number): Promise<UpdateResult> {
    return await this.chargeRepository.update({ id }, { amount });
  }
}
