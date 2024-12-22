import { Picture } from './picture.entity';
import { Characteristic } from './characteristic.entity';
export declare class Vehicle {
    id: string;
    idVeeKLS: string;
    odometer: number;
    price: number;
    gearbox: string;
    brand: string;
    model: string;
    color: string;
    fuel: string;
    type: string;
    year: number;
    plate: string;
    version: string;
    message: string;
    characteristics: Characteristic[];
    pictures: Picture[];
}
