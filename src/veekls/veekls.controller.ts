import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VeeklsService } from './veekls.service';

@Controller('veekls')
export class VeeklsController {
  constructor(private readonly veeklsService: VeeklsService) {}

  @Get()
  findAll() {
    return this.veeklsService.getVehiclesData();
  }

}
