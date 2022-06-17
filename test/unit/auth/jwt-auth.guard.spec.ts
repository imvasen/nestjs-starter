import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtAuthGuard()).toBeDefined();
  });
});
