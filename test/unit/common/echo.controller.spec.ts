import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { EchoController, EchoService } from '@/common/echo';

describe('EchoController', () => {
  let controller: EchoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EchoController],
      imports: [HttpModule],
      providers: [EchoService],
    }).compile();

    controller = module.get<EchoController>(EchoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
