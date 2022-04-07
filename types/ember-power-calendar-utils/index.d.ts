declare module 'ember-power-calendar-utils' {
  export interface NormalizedDate {
    date: Date;
    moment?: moment.Moment;
  }

  export interface NormalizedDates {
    date: Date[];
    moment?: moment.Moment[];
  }

  export interface NormalizedRange {
    date: { start: Date; end: Date };
    moment?: { start: moment.Moment; end: moment.Moment };
  }

  export function add(date: Date, quantity: number, unit: string): Date;
  export function formatDate(date: Date, format: string, locale?: string): string;

  export function startOf(date: Date, unit: string): Date;
  export function endOf(date: Date, unit: string): Date;

  export function weekday(date: Date): number;
  export function isoWeekday(date: Date): number;

  export function getWeekdaysShort(): string[];
  export function getWeekdaysMin(): string[];
  export function getWeekdays(): string[];

  export function isAfter(date1: Date, date2?: Date): boolean;
  export function isBefore(date1: Date, date2?: Date): boolean;
  export function isSame(date1: Date, date2: Date, unit: string): boolean;
  export function isBetween(
    date: Date,
    start: Date,
    end: Date,
    unit?: string,
    inclusivity?: '[]' | '[)' | '()' | '(]'
  ): boolean;

  export function diff(date1: Date, date2: Date): number;

  export function normalizeDate(date?: Date | moment.Moment): Date;

  export function normalizeRangeActionValue(range: {
    date: { start?: Date | null; end?: Date | null };
  }): NormalizedRange;
  export function normalizeMultipleActionValue(day: { date: Date[] }): NormalizedDates;
  export function normalizeCalendarDay<T = {}>(
    day: { date: Date } & Omit<T, 'moment'>
  ): { moment: moment.Moment; date: Date } & T;
  export function normalizeCalendarValue(day: { date: Date }): NormalizedDate;
  export function normalizeDuration(value: string | number | null): null | number;

  export function withLocale<T>(locale: string, fn: () => T): T;
  export function getDefaultLocale(): string;
  export function localeStartOfWeek(locale: string): number;
  export function startOfWeek(day: Date, startOfWeek: number): Date;
  export function endOfWeek(day: Date, startOfWeek: number): Date;
}
