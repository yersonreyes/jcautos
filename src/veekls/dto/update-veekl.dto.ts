import { PartialType } from '@nestjs/mapped-types';
import { CreateVeeklDto } from './create-veekl.dto';

export class UpdateVeeklDto extends PartialType(CreateVeeklDto) {}
