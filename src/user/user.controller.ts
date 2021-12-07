import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserDeco } from 'src/common/user.decorator';
import { CreateUserDto } from './user.dto';
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

  @Post()
  async signup(@Req() req: Request, @Body() data: CreateUserDto) {
    return await this.userService.create(req['gfUser'], data.fcmToken);
  }
}
