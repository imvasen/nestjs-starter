import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { HttpFilter, HttpInterceptor, Logger } from '@/common';
import { AppModule } from '@/app.module';
import * as config from '@/config';

async function bootstrap() {
  const logLabel = 'Nest';
  const logger = new Logger(logLabel);
  const app = await NestFactory.create(AppModule, { logger });
  await app.useGlobalInterceptors(new HttpInterceptor());
  await app.useGlobalFilters(new HttpFilter());
  await app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });
  await app.setGlobalPrefix('api');
  await app.listen(config.PORT);
}

bootstrap();
