import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { Characteristic } from './entities/characteristic.entity';
import { Picture } from './entities/picture.entity';
import { Cron, Interval } from '@nestjs/schedule';

@Injectable()
export class VeeklsService {

  vehicles = []

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Characteristic)
    private readonly characteristicRepository: Repository<Characteristic>,
    @InjectRepository(Picture)
    private readonly pictureRepository: Repository<Picture>,
    private readonly httpService: HttpService) {}

  async descargarImagen(imageUrl: string, fileName: string): Promise<string> {
    // Directorio donde se guardará la imagen
    //const directory = path.join(__dirname, '..', 'images'); // puedes ajustar la ruta

    //const directory = path.join('/', 'public_html', 'wp-content', 'uploads');

    const directory = path.join(__dirname, '..','..','..', 'public_html','wp-content','uploads','images'); 

    // Verifica si el directorio existe; si no, créalo
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true }); // Crea el directorio y subdirectorios si no existen
    }

    // Asegúrate de que el archivo tenga la extensión .jpg
    if (!fileName.endsWith('.jpg')) {
      fileName += '.jpg';
    }

    // Crea el flujo de escritura en un archivo con la ruta completa
    const filePath = path.join(directory, fileName);
    const writer = createWriteStream(filePath);

    try {
      // Realiza la solicitud GET y obtén la respuesta como un flujo
      const response = await lastValueFrom(
        this.httpService.get(imageUrl, { responseType: 'stream' })
      );

      // Redirige el flujo de datos de la respuesta al archivo
      response.data.pipe(writer);

      // Espera hasta que el archivo esté completamente guardado
      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filePath));
        writer.on('error', (error) => reject(error));
      });
    } catch (error) {
      console.error('Error descargando la imagen:', error);
      throw new Error('No se pudo descargar la imagen');
    }
  }
 
  async descargaImagenDeVehiculos(){
    const vehicles = this.vehicles;
    vehicles.forEach(vehicle => {
        vehicle.pictures.forEach(async picture => { 
          let imagePath = `https://pictures.veekls.com/${picture}/` 
          await this.descargarImagen(imagePath, picture);
        }
    )});
  }

  getVehiclesData(skip: number = 0, limit: number = 50): Observable<any> {
    const url = `https://vehicles.public.api.veekls.com/?skip=${skip}&limit=${limit}`;
    const headers = {
      'Authorization': 'Basic ' + 'NjEyNGYyY2Q4MWY2YjQ1MGFlNWIxOTNhOkFrMmdOOTVVYVoxZUxIS0NyWjAyQkVoYmlaU1FJMU5EczdQeUY4b0RKdjg='
    };
    return this.httpService.get(url, { headers }).pipe(
      map(async response => {
        this.vehicles = response.data;
        await this.pictureRepository.createQueryBuilder().delete().from('picture').execute();
        await this.characteristicRepository.createQueryBuilder().delete().from('characteristic').execute();
        await this.vehicleRepository.createQueryBuilder().delete().from('vehicle').execute();



        return this.vehicles;
      }),
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Error fetching data from vehicles API'));
      }),
    );
  }

  async createVehicle(data: any): Promise<Vehicle> {
    // Crear el vehículo
    const vehicle = this.vehicleRepository.create({
      idVeeKLS: data._id,
      odometer: data.odometer,
      price: data.price,
      gearbox: data.gearbox,
      brand: data.brand,
      model: data.model,
      color: data.color,
      fuel: data.fuel,
      type: data.type,
      year: data.year,
      plate: data.plate,
      version: data.version,
    });

    // Crear y asociar características al vehículo relacion de uno a muchos

    const characteristics = await Promise.all(
      data.characteristics.map(async (characteristic) => {
        const charEntity = this.characteristicRepository.create({ name: characteristic });
        return this.characteristicRepository.save(charEntity);
      })
    );

    vehicle.characteristics = characteristics;

    // Crear y asociar imágenes

    const pictures = await Promise.all(
      data.pictures.map(async (picture) => {
        const picEntity = this.pictureRepository.create({ name: picture });
        return this.pictureRepository.save(picEntity);
      })
    );

    vehicle.pictures = pictures;


    // Guardar el vehículo completo con sus relaciones
    return this.vehicleRepository.save(vehicle);
    


  }

  async processarVehiculos() {
    try {
      await lastValueFrom(this.getVehiclesData());
      await this.descargaImagenDeVehiculos();
      await Promise.all(this.vehicles.map(async (vehicle) => {
        return this.createVehicle(vehicle);
      }));
    } catch (error) {
      console.error('Error processing vehicles:', error);
    }
    return this.vehicles;
  }

  @Interval(5 * 60 * 1000) // Cada 5 minutos en milisegundos

  async tareaProgramada() {
    try {
      await lastValueFrom(this.getVehiclesData());
      await this.descargaImagenDeVehiculos();
      await Promise.all(this.vehicles.map(async (vehicle) => {
        return this.createVehicle(vehicle);
      }));
      console.log('Vehículos procesados:', this.vehicles.length);
    } catch (error) {
      console.error('Error processing vehicles:', error);
    }
  }
}

