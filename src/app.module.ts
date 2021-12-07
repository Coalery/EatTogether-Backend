import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { PartyModule } from './party/party.module';
import { UserModule } from './user/user.module';
import config from './common/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/http_exception.filter';
import { GetUserModule } from './middleware/get_user/get_user.module';
import { GetUserMiddleware } from './middleware/get_user/get_user.middleware';
import { ParticipateModule } from './participate/participate.module';
import { PurchaseModule } from './purchase/purchase.module';
import { TransformInterceptor } from './common/transform.interceptor';
import { CatchAllFilter } from './common/catch_all.filter';
import { AppLoggerMiddleware } from './common/logger.middleware';

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
    ParticipateModule,
    PurchaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: CatchAllFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppLoggerMiddleware, AuthMiddleware)
      .exclude('purchase/webhook')
      .forRoutes('*')
      .apply(GetUserMiddleware)
      .exclude('purchase/webhook', {
        path: 'user',
        method: RequestMethod.POST,
      })
      .forRoutes('*');
  }
}
