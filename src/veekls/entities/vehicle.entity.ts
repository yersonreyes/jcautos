import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';

import { Picture } from './picture.entity';
import { Characteristic } from './characteristic.entity';

@Entity('wp0p_vehicle')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  idVeeKLS: string;

  @Column({ type: 'int' })
  odometer: number;

  @Column({ type: 'float' })
  price: number;

  @Column()
  gearbox: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column()
  fuel: string;

  @Column()
  type: string;

  @Column({ type: 'int' })
  year: number;

  @Column()
  plate: string;

  @Column()
  version: string;

  @Column()
  message: string;

  // Relación uno a muchos con Characteristic
  @OneToMany(() => Characteristic, characteristic => characteristic.vehicle)
  characteristics: Characteristic[];

  //Relación uno a muchos con Picture
  @OneToMany(() => Picture, picture => picture.vehicle)
  pictures: Picture[];
}
