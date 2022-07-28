import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

import { EchoService } from '@/common/echo/echo.service';

@Controller('echo')
export class EchoController {
  constructor(private echo: EchoService) {}

  @Get('ip')
  ip(@Req() req: Request) {
    return this.echo.getIpInfo(req);
  }

  @Get('location')
  location(@Req() req: Request) {
    return this.echo.getGeoLocation(req);
  }
}
