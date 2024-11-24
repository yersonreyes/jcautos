import { VeeklsService } from './veekls.service';
export declare class VeeklsController {
    private readonly veeklsService;
    constructor(veeklsService: VeeklsService);
    findAll(): Promise<any[]>;
}
