import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { AuthController, AuthService } from '@/auth/auth';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { UsersService } from '@/auth/users';
import { CommonModule } from '@/common';
import { User } from '@/auth/models';
import { jwtOpts } from '@/config';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register(jwtOpts),
  ],
  exports: [TypeOrmModule],
  providers: [UsersService, AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
