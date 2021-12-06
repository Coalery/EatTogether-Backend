import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(uid: string): Promise<User> {
    return await this.userRepository.findOne(uid);
  }

  async findOndDetail(uid: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.participate', 'participate')
      .leftJoinAndSelect('participate.party', 'party')
      .where('user.`id` = :uid', { uid })
      .getOne();
  }

  async editAmount(uid: string, amount: number): Promise<User> {
    const user: User = await this.userRepository.findOne(uid);

    if (user.point + amount < 0) {
      throw new HttpException(
        {
          type: 'no-point',
          reason: `User ${user.name} not have enough points.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    user.point += amount;
    return await this.userRepository.save(user);
  }
}
