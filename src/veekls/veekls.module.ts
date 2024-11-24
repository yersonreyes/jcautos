import { Module } from '@nestjs/common';
import { VeeklsService } from './veekls.service';
import { VeeklsController } from './veekls.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Characteristic } from './entities/characteristic.entity';
import { Picture } from './entities/picture.entity';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, Characteristic, Picture]),
    HttpModule],
  controllers: [VeeklsController],
  providers: [VeeklsService],
})
export class VeeklsModule {}
