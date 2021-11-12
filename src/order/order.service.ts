import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async findOne(id: string): Promise<Order> {
    return await this.orderRepository.findOne(id);
  }

  async updateAmount(id: string, amount: number): Promise<UpdateResult> {
    return await this.orderRepository.update({ id }, { amount });
  }
}
