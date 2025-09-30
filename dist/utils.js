let dateLib;
function registerDateLibrary(dateLibrary) {
  dateLib = dateLibrary;
}
function getDateLibrary() {
  if (!dateLib) {
    throw new Error(`You have installed "ember-power-calendar" but you don't have registered any of the required meta-addons to make it work, like 'ember-power-calendar-moment' or 'ember-power-calendar-luxon'. Please add to your app and register the meta package in app.js.`);
  }
  return dateLib;
}
function add(date, quantity, unit) {
  return getDateLibrary().add(date, quantity, unit);
}
function formatDate(date, format, locale = null) {
  return getDateLibrary().formatDate(date, format, locale);
}
function startOf(date, unit) {
  return getDateLibrary().startOf(date, unit);
}
function endOf(date, unit) {
  return getDateLibrary().endOf(date, unit);
}
function weekday(date) {
  return getDateLibrary().weekday(date);
}
function isoWeekday(date) {
  return getDateLibrary().isoWeekday(date);
}
function getWeekdaysShort() {
  return getDateLibrary().getWeekdaysShort();
}
function getWeekdaysMin() {
  return getDateLibrary().getWeekdaysMin();
}
function getWeekdays() {
  return getDateLibrary().getWeekdays();
}
function isAfter(date1, date2) {
  return getDateLibrary().isAfter(date1, date2);
}
function isBefore(date1, date2) {
  return getDateLibrary().isBefore(date1, date2);
}
function isSame(date1, date2, unit) {
  return getDateLibrary().isSame(date1, date2, unit);
}
function isBetween(date, start, end, unit, inclusivity) {
  return getDateLibrary().isBetween(date, start, end, unit, inclusivity);
}
function diff(date1, date2) {
  return getDateLibrary().diff(date1, date2);
}
function normalizeDate(date) {
  return getDateLibrary().normalizeDate(date);
}
function normalizeRangeActionValue(val) {
  return getDateLibrary().normalizeRangeActionValue(val);
}
function normalizeMultipleActionValue(val) {
  return getDateLibrary().normalizeMultipleActionValue(val);
}
function normalizeCalendarDay(day) {
  return getDateLibrary().normalizeCalendarDay(day);
}
function withLocale(locale, fn) {
  return getDateLibrary().withLocale(locale, fn);
}
function normalizeCalendarValue(value) {
  return getDateLibrary().normalizeCalendarValue(value);
}
function normalizeDuration(value) {
  return getDateLibrary().normalizeDuration(value);
}
function getDefaultLocale() {
  return getDateLibrary().getDefaultLocale();
}
function localeStartOfWeek(locale) {
  return getDateLibrary().localeStartOfWeek(locale);
}
function startOfWeek(day, startOfWeek) {
  return getDateLibrary().startOfWeek(day, startOfWeek);
}
function endOfWeek(day, startOfWeek) {
  return getDateLibrary().endOfWeek(day, startOfWeek);
}

export { add, diff, endOf, endOfWeek, formatDate, getDefaultLocale, getWeekdays, getWeekdaysMin, getWeekdaysShort, isAfter, isBefore, isBetween, isSame, isoWeekday, localeStartOfWeek, normalizeCalendarDay, normalizeCalendarValue, normalizeDate, normalizeDuration, normalizeMultipleActionValue, normalizeRangeActionValue, registerDateLibrary, startOf, startOfWeek, weekday, withLocale };
//# sourceMappingURL=utils.js.map
