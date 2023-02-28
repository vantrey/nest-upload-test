import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/configuration';
import { createdApp } from './helpers/createdApp';
import { createWriteStream } from 'fs';
import { get } from 'http';
import { getSetupSwagger } from './swagger/getSetupSwagger';
import { TelegramAdapter } from './modules/integrations/adapters/telegram.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5005)

  // get the swagger json file (if app is running in development mode)
}

bootstrap();
