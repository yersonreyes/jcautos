import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import { readdir } from 'fs/promises';
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
    const directory = path.join(__dirname,'..', '..','..','public_html', 'wp-content', 'uploads','images',); // puedes ajustar la ruta


    //const directory = path.join(__dirname, '..','..','..', 'public_html','wp-content','uploads','images'); 

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
      return ''; // Continue execution even if an error occurs
    }
  }

  async eliminarImagenes() { 
    // obtiene todlas las imagenes de la base de datos
    const pictures = await this.pictureRepository.find();
    
    let  names = pictures.map(picture => picture.name + '.jpg');

    // elimina las imagenes del directorio  que no esten en la base de datos 
    const directory = path.join(__dirname,'..', '..','..','public_html', 'wp-content', 'uploads','images',); // puedes ajustar la ruta

    
    // elimina las imagenes del directorio  que no esten en la base de datos
    const files = await readdir(directory);


    files.forEach(async file => {
      if (!names.includes(file)) {
        const filePath = path.join(directory, file);
        await this.eliminarImagen(filePath);
      }
    });

    return [names, files];

  }

  async eliminarImagen(filePath: string) {
    try {
      if (existsSync

    (filePath)) {
        return new Promise((resolve, reject) => {
          unlink(filePath, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(filePath);
            }
          });
        });
      }
    } catch (error) {
      console.error('Error eliminando la imagen:', error);
      throw new Error('No se pudo eliminar la imagen');
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
  getVehiclesDataPrueba(skip: number = 0, limit: number = 50): Observable<any> {
    const url = `https://vehicles.public.api.veekls.com/`;
    const headers = {
      'Authorization': 'Basic ' + 'NjEyNGYyY2Q4MWY2YjQ1MGFlNWIxOTNhOkFrMmdOOTVVYVoxZUxIS0NyWjAyQkVoYmlaU1FJMU5EczdQeUY4b0RKdjg='
    };
    return this.httpService.get(url, { headers }).pipe(
      map(async response => {
        console.log('Vehículos obtenidos:', response.data.length);
      }),
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Error fetching data from vehicles API'));
      }),
    );
  }

  getVehiclesData(skip: number = 0, limit: number = 50): Observable<any> {
    const url1 = `https://vehicles.public.api.veekls.com/?skip=${skip}&limit=${limit}`;
    const headers = {
      'Authorization': 'Basic ' + 'NjEyNGYyY2Q4MWY2YjQ1MGFlNWIxOTNhOkFrMmdOOTVVYVoxZUxIS0NyWjAyQkVoYmlaU1FJMU5EczdQeUY4b0RKdjg='
    };
    return this.httpService.get(url1, { headers }).pipe(
      map(async response => {
        if (response.data.length === 0) {
          console.log('No hay más vehículos para procesar');
          return;
        }
        await this.pictureRepository.createQueryBuilder().delete().from('wp0p_picture').execute();
        await this.characteristicRepository.createQueryBuilder().delete().from('wp0p_characteristic').execute();
        await this.vehicleRepository.createQueryBuilder().delete().from('wp0p_vehicle').execute();
        this.vehicles = this.vehicles.concat(response.data);
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
      message: data.promo?.message || '',
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
      data.pictures.map(async (picture, index) => {

      const picEntity = this.pictureRepository.create({ 
        name: picture,
        principal: index === 0 ? true : false,
      });
      
      return this.pictureRepository.save(picEntity);
      })
    );

    vehicle.pictures = pictures;


    // Guardar el vehículo completo con sus relaciones
    return this.vehicleRepository.save(vehicle);
    


  }

  async processarVehiculos() {
    try {
      await lastValueFrom(this.getVehiclesData(0, 50));
      await lastValueFrom(this.getVehiclesData(50, 50));
      await lastValueFrom(this.getVehiclesData(100, 50));
      await Promise.all(this.vehicles.map(async (vehicle) => {
        return this.createVehicle(vehicle);
      }));
    } catch (error) {
      console.error('Error processing vehicles:', error);
    }
    console.log('Vehículos procesados:', this.vehicles.length);
    
    return this.vehicles;
  }

  @Interval(12 * 60 * 60 * 1000) // Cada 12 horas en milisegundos
  async tareaProgramada() {
    try {
      await lastValueFrom(this.getVehiclesData(0, 50));
      await lastValueFrom(this.getVehiclesData(50, 50));
      await lastValueFrom(this.getVehiclesData(100, 50));
      await Promise.all(this.vehicles.map(async (vehicle) => {
        return this.createVehicle(vehicle);
      }));
    } catch (error) {
      console.error('Error processing vehicles:', error);
    }
  }

  @Cron('0 0 1 * *') // Todos los días a la 1:00 AM
    async eliminarImagenesProgramada() {
      try {
        await this.eliminarImagenes();
        console.log('Imágenes eliminadas');
      } catch (error) {
        console.error('Error eliminando imágenes:', error);
      }
    }
}

