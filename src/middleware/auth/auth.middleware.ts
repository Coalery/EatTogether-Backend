import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { Resp } from 'src/common/response';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
      admin
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          req['gfUser'] = decodedToken;
          next();
        })
        .catch(() => {
          throw new HttpException(Resp.error(403), 403);
        });
    } else {
      throw new HttpException(Resp.error(403), 403);
    }
  }
}
