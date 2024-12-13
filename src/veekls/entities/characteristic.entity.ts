import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('wp0p_characteristic')
export class Characteristic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Vehicle, vehicle => vehicle.characteristics)
  vehicle: Vehicle;
}