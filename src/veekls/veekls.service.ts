import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import * as path from 'path';

@Injectable()
export class VeeklsService {

  constructor(private readonly httpService: HttpService) {}

  async downloadAndSaveImage(imageUrl: string, fileName: string): Promise<string> {
    // Directorio donde se guardará la imagen
    const directory = path.join(__dirname, '..', 'images'); // puedes ajustar la ruta

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


  getVehiclesData(): Observable<any> {
    const url = 'https://vehicles.public.api.veekls.com/';
    const headers = {
      'Authorization': 'Basic ' + 'NjEyNGYyY2Q4MWY2YjQ1MGFlNWIxOTNhOkFrMmdOOTVVYVoxZUxIS0NyWjAyQkVoYmlaU1FJMU5EczdQeUY4b0RKdjg='
    };
    return this.httpService.get(url, { headers }).pipe(
      map(async response => {
        const vehicles = response.data;
        vehicles.forEach(vehicle => {
            vehicle.pictures.forEach(async picture => { 

              let imagePath = `https://pictures.veekls.com/${picture}/` 
              await this.downloadAndSaveImage(imagePath, picture);
            }
        )});
        return vehicles;
      }),
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Error fetching data from vehicles API'));
      }),
    );
  }


}

