export interface DateLibrary {
    add: (date: Date, quantity: number, unit: string) => Date;
    formatDate: (date: Date, format: string, locale: string | null) => string;
    startOf: (date: Date, unit: string) => Date;
    endOf: (date: Date, unit: string) => Date;
    weekday: (date: Date) => number;
    isoWeekday: (date: Date) => number;
    getWeekdaysShort: () => string[];
    getWeekdaysMin: () => string[];
    getWeekdays: () => string[];
    isAfter: (date1: Date, date2: Date) => boolean;
    isBefore: (date1: Date, date2: Date) => boolean;
    isSame: (date1: Date, date2: Date, unit: string) => boolean;
    isBetween: (date: Date, start: Date, end: Date, unit?: string, inclusivity?: string) => boolean;
    diff: (date1: Date, date2: Date) => number;
    normalizeDate: (date?: unknown) => Date | undefined;
    normalizeRangeActionValue: (val: RangeActionValue) => NormalizeRangeActionValue;
    normalizeMultipleActionValue: (val: {
        date: Date[];
    }) => NormalizeMultipleActionValue;
    normalizeCalendarDay: (day: PowerCalendarDay) => PowerCalendarDay;
    withLocale: (locale: string, fn: () => unknown) => unknown;
    normalizeCalendarValue: (value: {
        date: Date;
    }) => NormalizeCalendarValue;
    normalizeDuration: (value: unknown) => number | null | undefined;
    getDefaultLocale: () => string;
    localeStartOfWeek: (locale: string) => number;
    startOfWeek: (day: Date, startOfWeek: number) => Date;
    endOfWeek: (day: Date, startOfWeek: number) => Date;
}
export interface NormalizeRangeActionValue {
    date: {
        start?: Date | null;
        end?: Date | null;
    };
    moment?: {
        start?: unknown;
        end?: unknown;
    };
    datetime?: {
        start?: unknown;
        end?: unknown;
    };
}
export interface NormalizeMultipleActionValue {
    date: Date[];
    moment?: unknown[];
    datetime?: unknown[];
}
export interface NormalizeCalendarValue {
    date: Date | undefined;
    moment?: unknown;
    datetime?: unknown;
}
export interface RangeActionValue {
    date: SelectedPowerCalendarRange;
}
export interface SelectedPowerCalendarRange {
    start?: Date | null;
    end?: Date | null;
}
export interface PowerCalendarDay {
    id: string;
    number: number;
    date: Date;
    moment?: unknown;
    datetime?: unknown;
    isFocused: boolean;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isRangeStart?: boolean;
    isRangeEnd?: boolean;
    isDisabled: boolean;
}
export declare function registerDateLibrary(dateLibrary: DateLibrary): void;
export declare function add(date: Date, quantity: number, unit: string): Date;
export declare function formatDate(date: Date, format: string, locale?: string | null): string;
export declare function startOf(date: Date, unit: string): Date;
export declare function endOf(date: Date, unit: string): Date;
export declare function weekday(date: Date): number;
export declare function isoWeekday(date: Date): number;
export declare function getWeekdaysShort(): string[];
export declare function getWeekdaysMin(): string[];
export declare function getWeekdays(): string[];
export declare function isAfter(date1: Date, date2: Date): boolean;
export declare function isBefore(date1: Date, date2: Date): boolean;
export declare function isSame(date1: Date, date2: Date, unit: string): boolean;
export declare function isBetween(date: Date, start: Date, end: Date, unit: string, inclusivity: string): boolean;
export declare function diff(date1: Date, date2: Date): number;
export declare function normalizeDate(date?: unknown): Date | undefined;
export declare function normalizeRangeActionValue(val: RangeActionValue): NormalizeRangeActionValue;
export declare function normalizeMultipleActionValue(val: {
    date: Date[];
}): NormalizeMultipleActionValue;
export declare function normalizeCalendarDay(day: PowerCalendarDay): PowerCalendarDay;
export declare function withLocale(locale: string, fn: () => unknown): unknown;
export declare function normalizeCalendarValue(value: {
    date: Date;
}): NormalizeCalendarValue;
export declare function normalizeDuration(value: unknown): number | null | undefined;
export declare function getDefaultLocale(): string;
export declare function localeStartOfWeek(locale: string): number;
export declare function startOfWeek(day: Date, startOfWeek: number): Date;
export declare function endOfWeek(day: Date, startOfWeek: number): Date;
//# sourceMappingURL=utils.d.ts.map