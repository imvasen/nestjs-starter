import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { City, Country, IpGeoLocation, State, Timezone } from '@/common/models';
import { EchoController, EchoService } from '@/common/echo';
import { repoMockFactory } from 'unit/repository.mock';
import { PlacesService } from '@/common/places';

describe('EchoController', () => {
  let controller: EchoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EchoController],
      providers: [
        EchoService,
        PlacesService,
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

    controller = module.get<EchoController>(EchoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
