let dateLib;

export function registerDateLibrary(dateLibrary) {
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

export function add(date, quantity, unit) {
  return getDateLibrary().add(date, quantity, unit);
}

export function formatDate(date, format, locale = null) {
  return getDateLibrary().formatDate(date, format, locale);
}

export function startOf(date, unit) {
  return getDateLibrary().startOf(date, unit);
}

export function endOf(date, unit) {
  return getDateLibrary().endOf(date, unit);
}

export function weekday(date) {
  return getDateLibrary().weekday(date);
}

export function isoWeekday(date) {
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

export function isAfter(date1, date2) {
  return getDateLibrary().isAfter(date1, date2);
}

export function isBefore(date1, date2) {
  return getDateLibrary().isBefore(date1, date2);
}

export function isSame(date1, date2, unit) {
  return getDateLibrary().isSame(date1, date2, unit);
}

export function isBetween(date, start, end, unit, inclusivity) {
  return getDateLibrary().isBetween(date, start, end, unit, inclusivity);
}

export function diff(date1, date2) {
  return getDateLibrary().diff(date1, date2);
}

export function normalizeDate(date) {
  return getDateLibrary().normalizeDate(date);
}

export function normalizeRangeActionValue(val) {
  return getDateLibrary().normalizeRangeActionValue(val);
}

export function normalizeMultipleActionValue(val) {
  return getDateLibrary().normalizeMultipleActionValue(val);
}

export function normalizeCalendarDay(day) {
  return getDateLibrary().normalizeCalendarDay(day);
}

export function withLocale(locale, fn) {
  return getDateLibrary().withLocale(locale, fn);
}

export function normalizeCalendarValue(value) {
  return getDateLibrary().normalizeCalendarValue(value);
}

export function normalizeDuration(value) {
  return getDateLibrary().normalizeDuration(value);
}

export function getDefaultLocale() {
  return getDateLibrary().getDefaultLocale();
}

export function localeStartOfWeek(locale) {
  return getDateLibrary().localeStartOfWeek(locale);
}

export function startOfWeek(day, startOfWeek) {
  return getDateLibrary().startOfWeek(day, startOfWeek);
}

export function endOfWeek(day, startOfWeek) {
  return getDateLibrary().endOfWeek(day, startOfWeek);
}
