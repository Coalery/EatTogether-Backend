import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { PartyModule } from './party/party.module';
import { UserModule } from './user/user.module';
import config from './config/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http_exception.filter';
import { GetUserModule } from './middleware/get_user/get_user.module';
import { GetUserMiddleware } from './middleware/get_user/get_user.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRoot(),
    PartyModule,
    UserModule,
    GetUserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*')
      .apply(GetUserMiddleware)
      .forRoutes(
        { path: 'party', method: RequestMethod.POST },
        { path: 'party', method: RequestMethod.DELETE },
      );
  }
}
