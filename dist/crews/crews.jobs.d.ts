import { CrewsService } from './crews.service';
export declare class CrewsJobs {
    private readonly crews;
    private readonly logger;
    constructor(crews: CrewsService);
    generateNextWeek(): Promise<void>;
}
