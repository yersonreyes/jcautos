import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('wp0p_picture')
export class Picture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // Relación muchos a uno con Vehicle
  @ManyToOne(() => Vehicle, vehicle => vehicle.pictures)
  vehicle: Vehicle;
}