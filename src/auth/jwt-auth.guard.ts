import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends PassportAuthGuard('jwt') {}
