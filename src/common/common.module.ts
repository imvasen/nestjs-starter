import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { EchoService } from './echo/echo.service';
import { cache, typeorm } from '@/common/config';
import { EchoController } from '@/common/echo';

@Module({
  imports: [
    CacheModule.register(cache),
    HttpModule,
    TypeOrmModule.forRoot(typeorm),
  ],
  providers: [EchoService],
  controllers: [EchoController],
})
export class CommonModule {}
