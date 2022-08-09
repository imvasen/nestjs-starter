import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { repoMockFactory } from 'unit/repository.mock';
import { UsersService } from '@/auth/users';
import { AuthService } from '@/auth/auth';
import { User } from '@/auth/models';

describe('AuthService', () => {
  let usersService: UsersService;
  let mockRepo: Repository<User>;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'Test' })],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repoMockFactory(User),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    mockRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const user = { email: 'test@test.com', password: 'mocked' };
    const usersBeforeCreation = (await mockRepo.find({})).length;

    await service.createUser(user);
    const usersAfterCreation = (await mockRepo.find({})).length;

    expect(usersBeforeCreation).toBe(usersAfterCreation - 1);
  });

  it('should throw HttpException (CONFLICT) when dup user', async () => {
    const user = { email: 'test@test.com', password: 'mocked' };
    const insertSpyOn = jest.spyOn(mockRepo, 'insert');
    insertSpyOn.mockImplementation(() => {
      throw new Error('duplicate key violates constraint');
    });

    await service
      .createUser(user)
      .then(() => expect('should have thrown an error').toBe(false))
      .catch((err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.CONFLICT);
      });
  });

  it('should throw HttpException (INTERNAL SERVER) when unknown', async () => {
    const user = { email: 'test@test.com', password: 'mocked' };
    const insertSpyOn = jest.spyOn(mockRepo, 'insert');
    insertSpyOn.mockImplementation(() => {
      throw new Error();
    });

    await service
      .createUser(user)
      .then(() => expect('should have thrown an error').toBe(false))
      .catch((err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      });
  });

  it('should throw HttpException (FORBIDDEN) when wrong user/password', async () => {
    const user = new User();
    user.id = '1';
    user.email = 'test@test.com';
    user.password = 'Mocked';
    await user.beforeInsert();

    jest.spyOn(usersService, 'getUser').mockImplementation(async () => user);
    await service
      .getJwt({ email: user.email, password: 'WrongPassword' })
      .then(() => expect('should have thrown error').toBe(true))
      .catch((err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
      });

    jest.spyOn(usersService, 'getUser').mockImplementation(async () => null);
    await service
      .getJwt({ email: 'doesNotExist@test.com', password: 'Mocked' })
      .then(() => expect('should have thrown error').toBe(true))
      .catch((err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
      });
  });

  it('should return a JWT if correct user & password', async () => {
    const user = new User();
    user.id = '1';
    user.email = 'test@test.com';
    user.password = 'Mocked';
    await user.beforeInsert();

    jest.spyOn(usersService, 'getUser').mockImplementation(async () => user);
    const { jwt } = await service.getJwt({
      email: user.email,
      password: 'Mocked',
    });
    expect(jwt).toBeDefined();
  });
});
