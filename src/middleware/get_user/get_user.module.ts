import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { GetUserMiddleware } from './get_user.middleware';

@Module({
  imports: [UserModule],
  providers: [GetUserMiddleware],
})
export class GetUserModule {}
