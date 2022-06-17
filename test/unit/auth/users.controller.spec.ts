import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Request } from 'express';

import { UsersController } from '@/auth/users/users.controller';
import { repoMockFactory } from 'unit/repository.mock';
import { UsersService } from '@/auth/users';
import { AuthService } from '@/auth/auth';
import { User } from '@/auth/models';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'Test' })],
      controllers: [UsersController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repoMockFactory(User),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get profile of signed user', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@test.com';
    user.password = 'Mocked';
    await user.beforeInsert();

    const controllerUser = controller.getProfile({
      user,
    } as unknown as Request);

    expect(controllerUser.email).toBe(user.email);
  });
});
