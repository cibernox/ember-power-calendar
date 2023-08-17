import {
  dependencySatisfies,
  macroCondition,
  importSync,
} from '@embroider/macros';

const DateLibrary = (() => {
  if (macroCondition(dependencySatisfies('ember-power-calendar-moment', '*'))) {
    return importSync('ember-power-calendar-moment');
  } else if (
    macroCondition(dependencySatisfies('ember-power-calendar-luxon', '*'))
  ) {
    return importSync('ember-power-calendar-luxon');
  } else {
    throw new Error(
      `You have installed "ember-power-calendar" but you don't have any of the required meta-addons to make it work, like 'ember-power-calendar-moment' or 'ember-power-calendar-luxon'. Please add to your app.`,
    );
  }
})();

export function add(date, quantity, unit) {
  return DateLibrary.add(date, quantity, unit);
}

export function formatDate(date, format, locale = null) {
  return DateLibrary.formatDate(date, format, locale);
}

export function startOf(date, unit) {
  return DateLibrary.startOf(date, unit);
}

export function endOf(date, unit) {
  return DateLibrary.endOf(date, unit);
}

export function weekday(date) {
  return DateLibrary.weekday(date);
}

export function isoWeekday(date) {
  return DateLibrary.isoWeekday(date);
}

export function getWeekdaysShort() {
  return DateLibrary.getWeekdaysShort();
}

export function getWeekdaysMin() {
  return DateLibrary.getWeekdaysMin();
}

export function getWeekdays() {
  return DateLibrary.getWeekdays();
}

export function isAfter(date1, date2) {
  return DateLibrary.isAfter(date1, date2);
}

export function isBefore(date1, date2) {
  return DateLibrary.isBefore(date1, date2);
}

export function isSame(date1, date2, unit) {
  return DateLibrary.isSame(date1, date2, unit);
}

export function isBetween(date, start, end, unit, inclusivity) {
  return DateLibrary.isBetween(date, start, end, unit, inclusivity);
}

export function diff(date1, date2) {
  return DateLibrary.diff(date1, date2);
}

export function normalizeDate(date) {
  return DateLibrary.normalizeDate(date);
}

export function normalizeRangeActionValue(val) {
  return DateLibrary.normalizeRangeActionValue(val);
}

export function normalizeMultipleActionValue(val) {
  return DateLibrary.normalizeMultipleActionValue(val);
}

export function normalizeCalendarDay(day) {
  return DateLibrary.normalizeCalendarDay(day);
}

export function withLocale(locale, fn) {
  return DateLibrary.withLocale(locale, fn);
}

export function normalizeCalendarValue(value) {
  return DateLibrary.normalizeCalendarValue(value);
}

export function normalizeDuration(value) {
  return DateLibrary.normalizeDuration(value);
}

export function getDefaultLocale() {
  return DateLibrary.getDefaultLocale();
}

export function localeStartOfWeek(locale) {
  return DateLibrary.localeStartOfWeek(locale);
}

export function startOfWeek(day, startOfWeek) {
  return DateLibrary.startOfWeek(day, startOfWeek);
}

export function endOfWeek(day, startOfWeek) {
  return DateLibrary.endOfWeek(day, startOfWeek);
}
