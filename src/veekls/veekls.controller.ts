import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VeeklsService } from './veekls.service';

@Controller('veekls')
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
    return 'Hola mundo';
  }

}
