export declare const AGENCY_TZ = "America/New_York";
export interface NyNow {
    dateStr: string;
    weekday: number;
    minutes: number;
}
export declare function nyNow(now?: Date): NyNow;
export declare function weekdayOf(dateStr: string): number;
export declare function addDays(dateStr: string, days: number): string;
export declare function startOfWeek(dateStr: string): string;
export declare function parseHm(time: string): number;
export declare function toDbDate(dateStr: string): Date;
export declare function fromDbDate(date: Date): string;
export declare function isBeforeDeadline(now: NyNow, dateStr: string, daysBefore: number, time: string): boolean;
export declare function ageInYears(dob: Date, onDate: string): number;
