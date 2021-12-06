import { Controller, Get } from '@nestjs/common';
import { UserDeco } from 'src/common/user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findMe(@UserDeco() requestor: User) {
    return requestor;
  }

  @Get('detail')
  async findMeDetail(@UserDeco() requestor: User) {
    return await this.userService.findOndDetail(requestor.id);
  }
}
