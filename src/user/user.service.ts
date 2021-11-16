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

  async editAmount(uid: string, amount: number): Promise<User> {
    const user: User = await this.userRepository.findOne(uid);

    if (user.point + amount < 0) {
      throw new HttpException(
        `User ${user.name} not have enough points.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    user.point += amount;
    return await this.userRepository.save(user);
  }
}
