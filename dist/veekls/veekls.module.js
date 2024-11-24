"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeeklsModule = void 0;
const common_1 = require("@nestjs/common");
const veekls_service_1 = require("./veekls.service");
const veekls_controller_1 = require("./veekls.controller");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const characteristic_entity_1 = require("./entities/characteristic.entity");
const picture_entity_1 = require("./entities/picture.entity");
const vehicle_entity_1 = require("./entities/vehicle.entity");
let VeeklsModule = class VeeklsModule {
};
exports.VeeklsModule = VeeklsModule;
exports.VeeklsModule = VeeklsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([vehicle_entity_1.Vehicle, characteristic_entity_1.Characteristic, picture_entity_1.Picture]),
            axios_1.HttpModule
        ],
        controllers: [veekls_controller_1.VeeklsController],
        providers: [veekls_service_1.VeeklsService],
    })
], VeeklsModule);
//# sourceMappingURL=veekls.module.js.map