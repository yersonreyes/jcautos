"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVeeklDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_veekl_dto_1 = require("./create-veekl.dto");
class UpdateVeeklDto extends (0, mapped_types_1.PartialType)(create_veekl_dto_1.CreateVeeklDto) {
}
exports.UpdateVeeklDto = UpdateVeeklDto;
//# sourceMappingURL=update-veekl.dto.js.map