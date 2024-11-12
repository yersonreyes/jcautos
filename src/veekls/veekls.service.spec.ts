import { Test, TestingModule } from '@nestjs/testing';
import { VeeklsService } from './veekls.service';

describe('VeeklsService', () => {
  let service: VeeklsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VeeklsService],
    }).compile();

    service = module.get<VeeklsService>(VeeklsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
