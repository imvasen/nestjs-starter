import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { UsersService } from '@/auth/users';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@/common';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(private users: UsersService, private jwt: JwtService) {}

  async createUser(userSkeleton: SignUpDto) {
    const user = await this.users
      .createUser(userSkeleton)
      .catch((err: Error) => {
        if (err.message.includes('duplicate key')) {
          throw new HttpException(
            { message: 'Email already registered' },
            HttpStatus.CONFLICT,
          );
        }

        this.logger.warn(`Unknown Error: ${err.message}`);
        throw new HttpException(
          {
            dev: {
              errorMessage: err.message,
              stackTrace: err.stack,
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
    return user;
  }

  async getJwt({ email, password }: SignInDto) {
    const user = await this.users.getUser({ email });
    if (!(await user?.validatePassword(password))) {
      throw new HttpException(
        { message: 'Incorrect user or password' },
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = { email };

    return { jwt: this.jwt.sign(payload, { subject: `${user.id}` }) };
  }
}
