import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VeeklsService } from './veekls.service';

@Controller('api/veekls')
export class VeeklsController {
  constructor(private readonly veeklsService: VeeklsService) {}

  @Get()
  findAll() {
    return this.veeklsService.processarVehiculos();
  }

  @Get('autos')
  verautos() {
    return this.veeklsService.getVehiclesDataPrueba();
  }

  @Get('test')
  findAll2() {
    return 'v001';
  }

  @Get('deleteImages')
  delete() {
    return this.veeklsService.eliminarImagenes();
  }

}
