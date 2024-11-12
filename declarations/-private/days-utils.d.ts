import type { CalendarAPI } from '../components/power-calendar.ts';
import { type PowerCalendarDay } from '../utils.ts';
export declare const WEEK_DAYS: string[];
export type TWeekdayFormat = 'min' | 'short' | 'long';
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
export declare function buildDay(date: Date, today: Date, calendar: CalendarAPI, focusedId: string | null, currentCenter: Date, dayIsSelected: (date: Date, calendar: CalendarAPI) => boolean, minDate?: Date, maxDate?: Date, disabledDates?: Array<Date | string>, dayIsDisabledExtended?: (date: Date, calendar: CalendarAPI, minDate?: Date, maxDate?: Date, disabledDates?: Array<Date | string>) => boolean): PowerCalendarDay;
export declare function dayIsDisabled(date: Date, calendar: CalendarAPI, minDate?: Date, maxDate?: Date, disabledDates?: Array<Date | string>): boolean;
export declare function lastDay(localeStartOfWeek: number, currentCenter: Date): Date;
export declare function handleClick(e: MouseEvent, days: PowerCalendarDay[], calendar: CalendarAPI): void;
//# sourceMappingURL=days-utils.d.ts.map