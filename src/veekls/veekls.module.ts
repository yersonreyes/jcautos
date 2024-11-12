import { Module } from '@nestjs/common';
import { VeeklsService } from './veekls.service';
import { VeeklsController } from './veekls.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [VeeklsController],
  providers: [VeeklsService],
})
export class VeeklsModule {}
