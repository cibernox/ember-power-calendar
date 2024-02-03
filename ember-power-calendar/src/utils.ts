import type { PowerCalendarDay } from './components/power-calendar';

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

export function add(date: Date, quantity: number, unit: string) {
  return getDateLibrary().add(date, quantity, unit);
}

export function formatDate(
  date: Date,
  format: string,
  locale: string | null = null,
) {
  return getDateLibrary().formatDate(date, format, locale);
}

export function startOf(date: Date, unit: string): Date {
  return getDateLibrary().startOf(date, unit);
}

export function endOf(date: Date, unit: string): Date {
  return getDateLibrary().endOf(date, unit);
}

export function weekday(date: Date) {
  return getDateLibrary().weekday(date);
}

export function isoWeekday(date: Date) {
  return getDateLibrary().isoWeekday(date);
}

export function getWeekdaysShort() {
  return getDateLibrary().getWeekdaysShort();
}

export function getWeekdaysMin() {
  return getDateLibrary().getWeekdaysMin();
}

export function getWeekdays() {
  return getDateLibrary().getWeekdays();
}

export function isAfter(date1: Date, date2: Date): boolean {
  return getDateLibrary().isAfter(date1, date2);
}

export function isBefore(date1: Date, date2?: Date): boolean {
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

export function normalizeDate(date?: Date): Date {
  return getDateLibrary().normalizeDate(date);
}

export function normalizeRangeActionValue(val: any) {
  return getDateLibrary().normalizeRangeActionValue(val);
}

export function normalizeMultipleActionValue(val: any) {
  return getDateLibrary().normalizeMultipleActionValue(val);
}

export function normalizeCalendarDay(day: PowerCalendarDay): PowerCalendarDay {
  return getDateLibrary().normalizeCalendarDay(day);
}

export function withLocale(locale: string, fn: () => void) {
  return getDateLibrary().withLocale(locale, fn);
}

export function normalizeCalendarValue(value: { date: Date }) {
  return getDateLibrary().normalizeCalendarValue(value);
}

export function normalizeDuration(value: any) {
  return getDateLibrary().normalizeDuration(value);
}

export function getDefaultLocale() {
  return getDateLibrary().getDefaultLocale();
}

export function localeStartOfWeek(locale: string) {
  return getDateLibrary().localeStartOfWeek(locale);
}

export function startOfWeek(day: Date, startOfWeek: string | number): Date {
  return getDateLibrary().startOfWeek(day, startOfWeek);
}

export function endOfWeek(day: Date, startOfWeek: string | number): Date {
  return getDateLibrary().endOfWeek(day, startOfWeek);
}
