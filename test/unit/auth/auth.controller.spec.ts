import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthController, AuthService } from '@/auth/auth';
import { repoMockFactory } from 'unit/repository.mock';
import { UsersService } from '@/auth/users';
import { User } from '@/auth/models';

describe('AuthController', () => {
  let usersService: UsersService;
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'Test' })],
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repoMockFactory(User),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the jwt from the newly created user', async () => {
    const user = new User();
    user.id = '1';
    user.email = 'test@test.com';
    user.password = 'Mocked';
    await user.beforeInsert();

    jest.spyOn(usersService, 'getUser').mockImplementation(async () => user);
    const { jwt } = await controller.signIn({
      email: user.email,
      password: 'Mocked',
    });
    expect(jwt).toBeDefined();
  });

  it('should return the jwt from the user signing in', async () => {
    const user = new User();
    user.id = '1';
    user.email = 'test@test.com';
    user.password = 'Mocked';
    await user.beforeInsert();

    jest.spyOn(usersService, 'getUser').mockImplementation(async () => user);
    const { jwt } = await controller.signIn({
      email: user.email,
      password: 'Mocked',
    });
    expect(jwt).toBeDefined();
  });

  it('should return the jwt from the user newly created', async () => {
    const user = new User();
    user.id = '1';
    user.email = 'test@test.com';
    user.password = 'Mocked';
    await user.beforeInsert();

    jest.spyOn(usersService, 'getUser').mockImplementation(async () => user);
    const { jwt } = await controller.signUp({
      email: user.email,
      password: 'Mocked',
    });
    expect(jwt).toBeDefined();
  });
});
