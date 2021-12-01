import { Controller, Get } from '@nestjs/common';
import { UserDeco } from 'src/common/user.decorator';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  @Get()
  async findMe(@UserDeco() requestor: User) {
    return requestor;
  }
}
