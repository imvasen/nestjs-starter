import { Body, Controller, Post } from '@nestjs/common';

import { AuthService, SignInDto, SignUpDto } from '@/auth/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('sign-up')
  signUp(@Body() userSkeleton: SignUpDto) {
    return this.auth.createUser(userSkeleton).then(() =>
      this.signIn({
        email: userSkeleton.email,
        password: userSkeleton.password,
      }),
    );
  }

  @Post('sign-in')
  signIn(@Body() { email, password }: SignInDto) {
    return this.auth.getJwt({ email, password });
  }
}
