import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Characteristic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Vehicle, vehicle => vehicle.characteristics)
  vehicle: Vehicle;
}