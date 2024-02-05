import type { Moment } from 'moment';
import type { PowerCalendarDay } from './components/power-calendar';
import type { PowerCalendarRangeSelectDay } from './components/power-calendar-range';

let dateLib: any;

export function registerDateLibrary(dateLibrary: any) {
  dateLib = dateLibrary;
}

function getDateLibrary() {
  if (!dateLib) {
    throw new Error(
      `You have installed "ember-power-calendar" but you don't have registered any of the required meta-addons to make it work, like 'ember-power-calendar-moment' or 'ember-power-calendar-luxon'. Please add to your app and register the meta package in app.js.`,
    );
  }

  return dateLib;
}

export interface NormalizeRangeActionValue {
  date: {
    start: Date | null;
    end: Date | null;
  };
  moment?: {
    start?: Date | Moment | null;
    end?: Date | Moment | null;
  };
  datetime?: {
    start?: Date | null;
    end?: Date | null;
  };
}

export interface NormalizeMultipleActionValue {
  date: Date[];
  moment?: Date[] | Moment[];
  datetime?: Date[];
}

export interface NormalizeCalendarValue {
  date: Date | undefined;
  moment?: Date | undefined;
  datetime?: Date | undefined;
}

export function add(date: Date, quantity: number, unit: string): Date {
  return getDateLibrary().add(date, quantity, unit);
}

export function formatDate(
  date: Date,
  format: string,
  locale: string | null = null,
): string {
  return getDateLibrary().formatDate(date, format, locale);
}

export function startOf(date: Date, unit: string): Date {
  return getDateLibrary().startOf(date, unit);
}

export function endOf(date: Date, unit: string): Date {
  return getDateLibrary().endOf(date, unit);
}

export function weekday(date: Date): number {
  return getDateLibrary().weekday(date);
}

export function isoWeekday(date: Date): number {
  return getDateLibrary().isoWeekday(date);
}

export function getWeekdaysShort(): string[] {
  return getDateLibrary().getWeekdaysShort();
}

export function getWeekdaysMin(): string[] {
  return getDateLibrary().getWeekdaysMin();
}

export function getWeekdays(): string[] {
  return getDateLibrary().getWeekdays();
}

export function isAfter(date1: Date, date2: Date): boolean {
  return getDateLibrary().isAfter(date1, date2);
}

export function isBefore(date1: Date, date2?: Date | null): boolean {
  return getDateLibrary().isBefore(date1, date2);
}

export function isSame(date1: Date, date2: Date, unit: string): boolean {
  return getDateLibrary().isSame(date1, date2, unit);
}

export function isBetween(
  date: Date,
  start: Date,
  end: Date,
  unit: string,
  inclusivity: string,
): boolean {
  return getDateLibrary().isBetween(date, start, end, unit, inclusivity);
}

export function diff(date1: Date, date2: Date): number {
  return getDateLibrary().diff(date1, date2);
}

export function normalizeDate(date?: Date | null): Date {
  return getDateLibrary().normalizeDate(date);
}

export function normalizeRangeActionValue(
  val: PowerCalendarRangeSelectDay,
): NormalizeRangeActionValue {
  return getDateLibrary().normalizeRangeActionValue(val);
}

export function normalizeMultipleActionValue(
  val: any,
): NormalizeMultipleActionValue {
  return getDateLibrary().normalizeMultipleActionValue(val);
}

export function normalizeCalendarDay(day: PowerCalendarDay): PowerCalendarDay {
  return getDateLibrary().normalizeCalendarDay(day);
}

export function withLocale(locale: string, fn: () => void): string[] {
  return getDateLibrary().withLocale(locale, fn);
}

export function normalizeCalendarValue(value: {
  date: Date;
}): NormalizeCalendarValue {
  return getDateLibrary().normalizeCalendarValue(value);
}

export function normalizeDuration(value: any): number {
  return getDateLibrary().normalizeDuration(value);
}

export function getDefaultLocale(): string {
  return getDateLibrary().getDefaultLocale();
}

export function localeStartOfWeek(locale: string): number {
  return getDateLibrary().localeStartOfWeek(locale);
}

export function startOfWeek(day: Date, startOfWeek: string | number): Date {
  return getDateLibrary().startOfWeek(day, startOfWeek);
}

export function endOfWeek(day: Date, startOfWeek: string | number): Date {
  return getDateLibrary().endOfWeek(day, startOfWeek);
}