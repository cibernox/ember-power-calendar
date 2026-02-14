import { type BaseCalendarAPI, type PowerCalendarDay, type TWeekdayFormat } from '../utils.ts';
export declare const DAY_IN_MS = 86400000;
export declare const WEEK_DAYS: string[];
export interface Week {
    id: string;
    days: PowerCalendarDay[];
    missingDays: number;
}
export declare function localeStartOfWeekOrFallback(startOfWeek: string | undefined, locale: string): number;
export declare function weekdaysNames(localeStartOfWeek: number, weekdayFormat: TWeekdayFormat, weekdays: string[], weekdaysMin: string[], weekdaysShort: string[]): string[];
export declare function firstDay(currentCenter: Date, localeStartOfWeek: number): Date;
export declare function weeks(days: PowerCalendarDay[], showDaysAround: boolean): Week[];
export declare function handleDayKeyDown(e: KeyboardEvent, focusedId: string | null, days: PowerCalendarDay[]): PowerCalendarDay | undefined;
export declare function focusDate(uniqueId: string, id: string): void;
export declare function buildDay<T extends BaseCalendarAPI<T>>(date: Date, today: Date, calendar: T, focusedId: string | null, currentCenter: Date, dayIsSelected: (date: Date, calendar: T) => boolean, minDate?: Date, maxDate?: Date, disabledDates?: Array<Date | string>, dayIsDisabledExtended?: (date: Date, calendar: T, minDate?: Date, maxDate?: Date, disabledDates?: Array<Date | string>) => boolean): PowerCalendarDay;
export declare function dayIsDisabled<T extends BaseCalendarAPI<T>>(date: Date, calendar: T, minDate?: Date, maxDate?: Date, disabledDates?: Array<Date | string>): boolean;
export declare function lastDay(localeStartOfWeek: number, currentCenter: Date): Date;
export declare function handleClick<T extends BaseCalendarAPI<T>>(e: MouseEvent, days: PowerCalendarDay[], calendar: T): PowerCalendarDay | undefined;
//# sourceMappingURL=days-utils.d.ts.map