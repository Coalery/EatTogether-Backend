import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';

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
          throw new HttpException('Not Valid Id Token', 403);
        });
    } else {
      throw new HttpException('Token is required', 403);
    }
  }
}
