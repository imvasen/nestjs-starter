import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { City, Country, State, Timezone } from '@/common/models';
import { EchoController, EchoService } from '@/common/echo';
import { cache, typeorm } from '@/common/config';
import { PlacesService } from '@/common/places';

@Module({
  imports: [
    CacheModule.register(cache),
    HttpModule,
    TypeOrmModule.forRoot(typeorm),
    TypeOrmModule.forFeature([Timezone, City, State, Country]),
  ],
  providers: [EchoService, PlacesService],
  controllers: [EchoController],
})
export class CommonModule {}
