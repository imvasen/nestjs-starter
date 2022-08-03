import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { City, Country, State, Timezone } from '@/common/models';
import { PlacesService } from '@/common/places/places.service';
import { repoMockFactory } from 'unit/repository.mock';

describe('PlacesService', () => {
  let service: PlacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
      ],
    }).compile();

    service = module.get<PlacesService>(PlacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
