import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { EchoService } from '@/common/echo/echo.service';

describe('EchoService', () => {
  let service: EchoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EchoService],
      imports: [HttpModule],
    }).compile();

    service = module.get<EchoService>(EchoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
