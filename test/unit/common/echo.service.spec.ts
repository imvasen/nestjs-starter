import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { City, Country, IpGeoLocation, State, Timezone } from '@/common/models';
import { EchoService } from '@/common/echo/echo.service';
import { repoMockFactory } from 'unit/repository.mock';
import { PlacesService } from '@/common/places';

describe('EchoService', () => {
  let service: EchoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesService,
        EchoService,
        {
          provide: getRepositoryToken(City),
          useFactory: repoMockFactory(City),
        },
        {
          provide: getRepositoryToken(State),
          useFactory: repoMockFactory(State),
        },
        {
          provide: getRepositoryToken(Country),
          useFactory: repoMockFactory(Country),
        },
        {
          provide: getRepositoryToken(Timezone),
          useFactory: repoMockFactory(Timezone),
        },
        {
          provide: getRepositoryToken(IpGeoLocation),
          useFactory: repoMockFactory(IpGeoLocation),
        },
      ],
      imports: [HttpModule],
    }).compile();

    service = module.get<EchoService>(EchoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
