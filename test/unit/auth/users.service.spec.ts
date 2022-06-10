import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

import { UsersService } from '@/auth/users';
import { User } from '@/auth/models';

describe('UsersService', () => {
  let service: UsersService;
  const repo = createMock<Repository<User>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should get users', async () => {
    const user = { email: 'test@test.com', password: 'mocked' };
    repo.findOne.mockResolvedValue(user as never);
    expect(await service.getUser({})).toEqual(user);
  });
});
