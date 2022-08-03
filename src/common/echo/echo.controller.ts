import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';

import { EchoService } from '@/common/echo/echo.service';

@Controller('echo')
export class EchoController {
  constructor(private echo: EchoService) {}

  @Get('ip')
  ip(@Req() { headers, socket }: Request, @Query('ip') ip?: string) {
    if (!ip) {
      ip = (headers['x-forwarded-for'] || socket.remoteAddress) as string;
    }

    return this.echo.getIpInfo(ip);
  }

  @Get('location')
  location(@Req() { headers, socket }: Request, @Query('ip') ip: string) {
    if (!ip) {
      ip = (headers['x-forwarded-for'] || socket.remoteAddress) as string;
    }

    return this.echo.getGeoLocationFromIp(ip);
  }
}
