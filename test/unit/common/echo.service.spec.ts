import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { EchoService } from '@/common/echo/echo.service';
import { repoMockFactory } from 'unit/repository.mock';
import { PlacesService } from '@/common/places';
import {
  City,
  Country,
  IpGeoLocation,
  IPVersion,
  State,
  Timezone,
} from '@/common/models';

describe('EchoService', () => {
  let service: EchoService;
  let places: PlacesService;

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
    // Mock DB retrieval
    places = module.get<PlacesService>(PlacesService);
    jest
      .spyOn(places, 'findCity')
      .mockImplementation(async (city, state, country) => ({
        city: city as City,
        state: state as State,
        country: country as Country,
      }));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return correct info for IPv6', () => {
    const ipToTest = '1234:5678:90ab:cdf1:2345:6789:0abc:ef';
    const ipToTestPrefix = '1234:5678:90ab::';
    const ipInfo = service.getIpInfo(ipToTest);

    expect(ipInfo.version).toBe(IPVersion.v6);
    expect(ipInfo.ip).toBe(ipToTest);
    expect(ipInfo.prefixOrBlock).toBe(ipToTestPrefix);
  });

  it('should return correct info for IPv4', () => {
    const ipToTest = '123.456.789.1';
    const ipToTestPrefix = '123.456.789.0';
    const ipInfo = service.getIpInfo(ipToTest);

    expect(ipInfo.version).toBe(IPVersion.v4);
    expect(ipInfo.ip).toBe(ipToTest);
    expect(ipInfo.prefixOrBlock).toBe(ipToTestPrefix);
  });

  it('should return location of IPv4', async () => {
    const ipToTest = '189.18.1.2';
    const ipLocation = await service.getGeoLocationFromIp(ipToTest);

    expect(ipLocation.city.name).toBe('Sao Paulo');
    expect(ipLocation.state.name).toBe('Sao Paulo');
    expect(ipLocation.country.isoAlpha2).toBe('BR');
  });

  it('should return location of IPv6', async () => {
    const ipToTest = '2806:11ae:30:1:d847:42b8:3b77:69ec'; // Murten, Fribourg, CHE
    const ipLocation = await service.getGeoLocationFromIp(ipToTest);

    expect(ipLocation.city.name).toBe('Murten/Morat');
    expect(ipLocation.state.name).toBe('Fribourg');
    expect(ipLocation.country.isoAlpha2).toBe('CH');
  });
});
