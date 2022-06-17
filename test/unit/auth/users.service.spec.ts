import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { repoMockFactory } from 'unit/repository.mock';
import { UsersService } from '@/auth/users';
import { User } from '@/auth/models';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repoMockFactory(User),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = { email: 'test@test.com', password: 'mocked' };
    const createSpyOn = jest.spyOn(mockRepo, 'create');
    const insertSpyOn = jest.spyOn(mockRepo, 'insert');
    const usersBeforeCreation = (await service.getUsers()).length;

    await service.createUser(user);

    expect(createSpyOn).toHaveBeenCalledTimes(1);
    expect(insertSpyOn).toHaveBeenCalledTimes(1);

    const usersAfterCreation = (await service.getUsers()).length;

    expect(usersBeforeCreation).toBe(usersAfterCreation - 1);
  });

  it('should return the user from repo as is', async () => {
    const user = new User();
    const createSpyOn = jest.spyOn(mockRepo, 'findOne');
    createSpyOn.mockImplementation(async () => user);

    const repoUser = await service.getUser({});

    expect(createSpyOn).toHaveBeenCalled();
    expect(repoUser).toBe(user);
  });
});
