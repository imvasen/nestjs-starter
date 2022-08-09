import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { IpGeoLocation, IPVersion } from '@/common/models';
import { PlacesService } from '@/common/places';
import { Logger } from '@/common/logger';

const GEO_LOCATION_API_URL = 'https://api.geoapify.com/v1/ipinfo';
const GEO_LOCATION_API_KEY = process.env.GEO_LOCATION_API_KEY;

export interface GeoLocationResponse {
  country: {
    name: string;
    iso_code: string;
    name_native: string;
    phone_code: string;
    capital: string;
    currency: string;
    flag: string;
    languages: Array<{
      iso_code: string;
      name: string;
      name_native: string;
    }>;
  };
  state: { name: string };
  city: { name: string };
  postcode: string;
  location: { latitude: number; longitude: number };
  continent: { code: string; name: string };
  ip: string;
}

@Injectable()
export class EchoService {
  private logger = new Logger('EchoService');

  constructor(
    private http: HttpService,
    private places: PlacesService,
    @InjectRepository(IpGeoLocation)
    private ipGeoService: Repository<IpGeoLocation>,
  ) {}

  /**
   * Gets the IP from the request.
   * @params req HttpRequest.
   * @returns IP info object.
   */
  getIpInfo(ip: string) {
    const version = ip.includes(':') ? IPVersion.v6 : IPVersion.v4;

    let prefixOrBlock: string;
    if (version === IPVersion.v4) {
      const pieces = ip.split('.');
      prefixOrBlock = `${pieces.slice(0, 3).join('.')}.0`;
    } else if (ip === '::1') {
      prefixOrBlock = '::1';
    } else {
      const pieces = ip.split(':');
      prefixOrBlock = `${pieces.slice(0, 3).join(':')}::`;
    }

    return { ip, version, prefixOrBlock };
  }

  public async getOrCreateIpGeoLocation(ipInfo: Partial<IpGeoLocation>) {
    const { prefixOrBlock } = ipInfo;
    let ipGeoLocation = await this.ipGeoService.findOne({
      where: { prefixOrBlock },
    });

    if (!ipGeoLocation) {
      this.logger.verbose(`IP [${ipInfo.prefixOrBlock}] not found in DB`);
      const ipLocation = await lastValueFrom(
        this.http.get<GeoLocationResponse>(`${GEO_LOCATION_API_URL}`, {
          params: { ip: ipInfo.prefixOrBlock, apiKey: GEO_LOCATION_API_KEY },
        }),
      ).then(({ data }) => data);

      if (!ipLocation.country) {
        this.logger.verbose('IP location cannot be found');
        return ipInfo;
      }

      const location = await this.places.findCity(
        { name: ipLocation.city?.name },
        { name: ipLocation.state?.name },
        { isoAlpha2: ipLocation?.country.iso_code },
      );

      const {
        city: { name: cityName },
        state: { name: stateName },
        country: { iso_code: countryCode },
      } = ipLocation;

      if (!location.country || !location.state || !location.city) {
        const notFound = !location.country
          ? 'Country'
          : !location.state
          ? 'State'
          : 'City';
        this.logger.warn(
          `${notFound} not found: [city:` +
            `${cityName},state:${stateName},country:${countryCode}]`,
        );
      }

      ipGeoLocation = await this.ipGeoService.create({
        ...ipInfo,
        ...location,
      });
      await this.ipGeoService.save(ipGeoLocation);
      this.logger.verbose(`IP [${ipInfo.prefixOrBlock}] saved in DB`);
    }

    return ipGeoLocation;
  }

  /**
   * Gets GeoLocation based on IP.
   * @param ip IP Address to get location.
   * @returns GeoLocation of the IP.
   */
  async getGeoLocationFromIp(ip: string) {
    const ipInfo = this.getIpInfo(ip);
    return await this.getOrCreateIpGeoLocation(ipInfo);
  }
}
