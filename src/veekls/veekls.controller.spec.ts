import { Test, TestingModule } from '@nestjs/testing';
import { VeeklsController } from './veekls.controller';
import { VeeklsService } from './veekls.service';

describe('VeeklsController', () => {
  let controller: VeeklsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VeeklsController],
      providers: [VeeklsService],
    }).compile();

    controller = module.get<VeeklsController>(VeeklsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
