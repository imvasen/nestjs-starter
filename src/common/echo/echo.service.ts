import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Request } from 'express';

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
  constructor(private http: HttpService) {}

  /**
   * Gets the IP from the request.
   * @params req HttpRequest.
   * @returns IP info object.
   */
  getIpInfo(req: Request) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    return { ip, version: ip.includes(':') ? 'v6' : 'v4' };
  }

  /**
   * Gets GeoLocation based on IP.
   * @param req HttpRequest.
   * @returns GeoLocation of the IP.
   */
  async getGeoLocation(req: Request) {
    const ipInfo = this.getIpInfo(req);

    return lastValueFrom(
      this.http.get<GeoLocationResponse>(`${GEO_LOCATION_API_URL}`, {
        params: { ip: ipInfo.ip, apiKey: GEO_LOCATION_API_KEY },
      }),
    ).then(({ data }) => data);
  }
}
