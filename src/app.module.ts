import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { PartyModule } from './party/party.module';
import { UserModule } from './user/user.module';
import config from './common/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/http_exception.filter';
import { GetUserModule } from './middleware/get_user/get_user.module';
import { GetUserMiddleware } from './middleware/get_user/get_user.middleware';
import { ParticipateModule } from './participate/participate.module';
import { PurchaseModule } from './purchase/purchase.module';
import { OrderModule } from './order/order.module';
import { ChargeModule } from './charge/charge.module';

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
    OrderModule,
    ChargeModule,
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
      .exclude('purchase/webhook')
      .forRoutes('*')
      .apply(GetUserMiddleware)
      .forRoutes(
        { path: 'party', method: RequestMethod.POST },
        { path: 'party', method: RequestMethod.DELETE },
      );
  }
}
