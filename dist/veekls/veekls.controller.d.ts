import { VeeklsService } from './veekls.service';
export declare class VeeklsController {
    private readonly veeklsService;
    constructor(veeklsService: VeeklsService);
    findAll(): Promise<any[]>;
    verautos(): import("rxjs").Observable<any>;
    findAll2(): string;
}
