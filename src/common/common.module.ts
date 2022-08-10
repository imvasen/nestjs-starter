import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { City, Country, State, Timezone, IpGeoLocation } from '@/common/models';
import { EchoController, EchoService } from '@/common/echo';
import { PlacesService } from '@/common/places';
import { cache, typeorm } from '@/config';

@Module({
  imports: [
    CacheModule.register(cache),
    HttpModule,
    TypeOrmModule.forRoot(typeorm),
    TypeOrmModule.forFeature([Timezone, City, State, Country, IpGeoLocation]),
  ],
  providers: [EchoService, PlacesService],
  controllers: [EchoController],
})
export class CommonModule {}
