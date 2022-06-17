import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/auth/models';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    const user: User = req.user as User;
    return {
      email: user.email,
    };
  }
}
