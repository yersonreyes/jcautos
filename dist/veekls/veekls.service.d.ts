import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { Characteristic } from './entities/characteristic.entity';
import { Picture } from './entities/picture.entity';
export declare class VeeklsService {
    private readonly vehicleRepository;
    private readonly characteristicRepository;
    private readonly pictureRepository;
    private readonly httpService;
    vehicles: any[];
    constructor(vehicleRepository: Repository<Vehicle>, characteristicRepository: Repository<Characteristic>, pictureRepository: Repository<Picture>, httpService: HttpService);
    descargarImagen(imageUrl: string, fileName: string): Promise<string>;
    eliminarImagenes(): Promise<string[][]>;
    eliminarImagen(filePath: string): Promise<unknown>;
    descargaImagenDeVehiculos(): Promise<void>;
    getVehiclesDataPrueba(skip?: number, limit?: number): Observable<any>;
    getVehiclesData(skip?: number, limit?: number): Observable<any>;
    createVehicle(data: any): Promise<Vehicle>;
    deleteData(): Promise<void>;
    processarVehiculos(): Promise<any[]>;
    tareaProgramada(): Promise<void>;
    eliminarImagenesProgramada(): Promise<void>;
}
