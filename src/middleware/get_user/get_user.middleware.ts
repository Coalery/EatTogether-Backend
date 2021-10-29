import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { auth } from 'firebase-admin';
import { Resp } from 'src/common/response';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token: auth.DecodedIdToken = req['gfUser'];
    this.userService.findOne(token.uid).then((user) => {
      if (!user) {
        throw new HttpException(Resp.error(400), HttpStatus.BAD_REQUEST);
      }

      req['user'] = user;
      next();
    });
  }
}
