"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeeklsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const rxjs_2 = require("rxjs");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path = require("path");
const typeorm_1 = require("@nestjs/typeorm");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const typeorm_2 = require("typeorm");
const characteristic_entity_1 = require("./entities/characteristic.entity");
const picture_entity_1 = require("./entities/picture.entity");
const schedule_1 = require("@nestjs/schedule");
let VeeklsService = class VeeklsService {
    constructor(vehicleRepository, characteristicRepository, pictureRepository, httpService) {
        this.vehicleRepository = vehicleRepository;
        this.characteristicRepository = characteristicRepository;
        this.pictureRepository = pictureRepository;
        this.httpService = httpService;
        this.vehicles = [];
    }
    async descargarImagen(imageUrl, fileName) {
        const directory = path.join(__dirname, '..', '..', '..', 'public_html', 'wp-content', 'uploads', 'images');
        if (!(0, fs_1.existsSync)(directory)) {
            (0, fs_1.mkdirSync)(directory, { recursive: true });
        }
        if (!fileName.endsWith('.jpg')) {
            fileName += '.jpg';
        }
        const filePath = path.join(directory, fileName);
        const writer = (0, fs_1.createWriteStream)(filePath);
        try {
            const response = await (0, rxjs_2.lastValueFrom)(this.httpService.get(imageUrl, { responseType: 'stream' }));
            response.data.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(filePath));
                writer.on('error', (error) => reject(error));
            });
        }
        catch (error) {
            console.error('Error descargando la imagen:', error);
            return '';
        }
    }
    async eliminarImagenes() {
        const pictures = await this.pictureRepository.find();
        let names = pictures.map(picture => picture.name + '.jpg');
        const directory = path.join(__dirname, '..', '..', '..', 'public_html', 'wp-content', 'uploads', 'images');
        const files = await (0, promises_1.readdir)(directory);
        files.forEach(async (file) => {
            if (!names.includes(file)) {
                const filePath = path.join(directory, file);
                await this.eliminarImagen(filePath);
            }
        });
        return [names, files];
    }
    async eliminarImagen(filePath) {
        try {
            if ((0, fs_1.existsSync)(filePath)) {
                return new Promise((resolve, reject) => {
                    (0, fs_1.unlink)(filePath, (error) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(filePath);
                        }
                    });
                });
            }
        }
        catch (error) {
            console.error('Error eliminando la imagen:', error);
            throw new Error('No se pudo eliminar la imagen');
        }
    }
    async descargaImagenDeVehiculos() {
        const vehicles = this.vehicles;
        vehicles.forEach(vehicle => {
            vehicle.pictures.forEach(async (picture) => {
                let imagePath = `https://pictures.veekls.com/${picture}/`;
                await this.descargarImagen(imagePath, picture);
            });
        });
    }
    getVehiclesDataPrueba(skip = 0, limit = 50) {
        const url = `https://vehicles.public.api.veekls.com/`;
        const headers = {
            'Authorization': 'Basic ' + 'NjEyNGYyY2Q4MWY2YjQ1MGFlNWIxOTNhOkFrMmdOOTVVYVoxZUxIS0NyWjAyQkVoYmlaU1FJMU5EczdQeUY4b0RKdjg='
        };
        return this.httpService.get(url, { headers }).pipe((0, operators_1.map)(async (response) => {
            console.log('Vehículos obtenidos:', response.data.length);
        }), (0, operators_1.catchError)(error => {
            console.error('Error fetching data:', error);
            return (0, rxjs_1.throwError)(() => new Error('Error fetching data from vehicles API'));
        }));
    }
    getVehiclesData(skip = 0, limit = 50) {
        const url1 = `https://vehicles.public.api.veekls.com/?skip=${skip}&limit=${limit}`;
        const headers = {
            'Authorization': 'Basic ' + 'NjEyNGYyY2Q4MWY2YjQ1MGFlNWIxOTNhOkFrMmdOOTVVYVoxZUxIS0NyWjAyQkVoYmlaU1FJMU5EczdQeUY4b0RKdjg='
        };
        return this.httpService.get(url1, { headers }).pipe((0, operators_1.map)(async (response) => {
            if (response.data.length === 0) {
                console.log('No hay más vehículos para procesar');
                return;
            }
            this.vehicles = this.vehicles.concat(response.data);
            return this.vehicles;
        }), (0, operators_1.catchError)(error => {
            console.error('Error fetching data:', error);
            return (0, rxjs_1.throwError)(() => new Error('Error fetching data from vehicles API'));
        }));
    }
    async createVehicle(data) {
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
        const characteristics = await Promise.all(data.characteristics.map(async (characteristic) => {
            const charEntity = this.characteristicRepository.create({ name: characteristic });
            return this.characteristicRepository.save(charEntity);
        }));
        vehicle.characteristics = characteristics;
        const pictures = await Promise.all(data.pictures.map(async (picture, index) => {
            const picEntity = this.pictureRepository.create({
                name: picture,
                principal: index === 0 ? true : false,
            });
            return this.pictureRepository.save(picEntity);
        }));
        vehicle.pictures = pictures;
        return this.vehicleRepository.save(vehicle);
    }
    async deleteData() {
        await this.pictureRepository.createQueryBuilder().delete().from('wp0p_picture').execute();
        await this.characteristicRepository.createQueryBuilder().delete().from('wp0p_characteristic').execute();
        await this.vehicleRepository.createQueryBuilder().delete().from('wp0p_vehicle').execute();
    }
    async processarVehiculos() {
        try {
            await this.deleteData();
            this.vehicles = [];
            await (0, rxjs_2.lastValueFrom)(this.getVehiclesData(0, 50));
            await (0, rxjs_2.lastValueFrom)(this.getVehiclesData(50, 50));
            await (0, rxjs_2.lastValueFrom)(this.getVehiclesData(100, 50));
            await Promise.all(this.vehicles.map(async (vehicle) => {
                return this.createVehicle(vehicle);
            }));
        }
        catch (error) {
            console.error('Error processing vehicles:', error);
        }
        console.log('Vehículos procesados:', this.vehicles.length);
        return this.vehicles;
    }
    async tareaProgramada() {
        try {
            await this.deleteData();
            this.vehicles = [];
            await (0, rxjs_2.lastValueFrom)(this.getVehiclesData(0, 50));
            await (0, rxjs_2.lastValueFrom)(this.getVehiclesData(50, 50));
            await (0, rxjs_2.lastValueFrom)(this.getVehiclesData(100, 50));
            await Promise.all(this.vehicles.map(async (vehicle) => {
                return this.createVehicle(vehicle);
            }));
        }
        catch (error) {
            console.error('Error processing vehicles:', error);
        }
    }
    async eliminarImagenesProgramada() {
        try {
            await this.eliminarImagenes();
            console.log('Imágenes eliminadas');
        }
        catch (error) {
            console.error('Error eliminando imágenes:', error);
        }
    }
};
exports.VeeklsService = VeeklsService;
__decorate([
    (0, schedule_1.Interval)(12 * 60 * 60 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VeeklsService.prototype, "tareaProgramada", null);
__decorate([
    (0, schedule_1.Cron)('0 0 1 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VeeklsService.prototype, "eliminarImagenesProgramada", null);
exports.VeeklsService = VeeklsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(characteristic_entity_1.Characteristic)),
    __param(2, (0, typeorm_1.InjectRepository)(picture_entity_1.Picture)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        axios_1.HttpService])
], VeeklsService);
//# sourceMappingURL=veekls.service.js.map