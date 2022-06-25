import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { UsersService } from '@/auth/users';
import { JwtPayload } from '@/auth/auth';
import { jwtOpts } from '@/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtOpts.secret,
    });
  }

  validate(payload: JwtPayload) {
    return { id: payload.sub };
  }
}
