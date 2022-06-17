import { User } from '@/auth/models';

describe('UserEntity', () => {
  it('should hash password when calling beforeInsert', async () => {
    const user = { email: 'test@test.com', password: 'mocked' };
    const userFromEntity = new User();
    userFromEntity.email = user.email;
    userFromEntity.password = user.password;
    await userFromEntity.beforeInsert();
    expect(user.password === userFromEntity.password).toBeFalsy();
  });

  it('should validate password against hashed password', async () => {
    const user = { email: 'test@test.com', password: 'mocked' };
    const userFromEntity = new User();
    userFromEntity.email = user.email;
    userFromEntity.password = user.password;
    await userFromEntity.beforeInsert();
    expect(await userFromEntity.validatePassword(user.password)).toBeTruthy();
    expect(await userFromEntity.validatePassword('FakedPassword')).toBeFalsy();
  });
});
