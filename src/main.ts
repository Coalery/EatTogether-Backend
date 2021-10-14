import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  const adminConfig: ServiceAccount = {
    projectId: configService.get('firebase.projectId'),
    privateKey: configService.get('firebase.privateKey').replace(/\\n/g, '\n'),
    clientEmail: configService.get('firebase.clientEmail'),
  };
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });

  await app.listen(3000);
}
bootstrap();
