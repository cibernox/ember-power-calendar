import { assert } from '@ember/debug';
import { settled, click } from '@ember/test-helpers';
import { formatDate } from '../utils.js';
export { add, diff, endOf, endOfWeek, getDefaultLocale, getWeekdays, getWeekdaysMin, getWeekdaysShort, isAfter, isBefore, isBetween, isSame, isoWeekday, localeStartOfWeek, normalizeCalendarDay, normalizeCalendarValue, normalizeDate, normalizeDuration, normalizeMultipleActionValue, normalizeRangeActionValue, registerDateLibrary, startOf, startOfWeek, weekday, withLocale } from '../utils.js';

var helpers = {};
function findCalendarElement(selector, rootElement) {
  let target = document.querySelector(selector);
  if (rootElement) {
    target = rootElement.querySelector(selector);
  }
  if (target) {
    if (target.classList.contains('ember-power-calendar')) {
      return target;
    } else {
      return target.querySelector('.ember-power-calendar') || target.querySelector('[data-power-calendar-id]');
    }
  }
}
function findCalendarGuid(selector, rootElement) {
  const maybeCalendar = findCalendarElement(selector, rootElement);
  if (!maybeCalendar) {
    return;
  }
  if (maybeCalendar.classList.contains('ember-power-calendar')) {
    return maybeCalendar.id;
  } else {
    return maybeCalendar.dataset['powerCalendarId'];
  }
}
function findComponentInstance(selector, rootElement) {
  const calendarGuid = findCalendarGuid(selector, rootElement);
  assert(`Could not find a calendar using selector: "${selector}"`, calendarGuid);
  // @ts-expect-error Property '__powerCalendars'
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return window.__powerCalendars?.[calendarGuid];
}
async function calendarCenter(selector, newCenter, rootElement) {
  assert('`calendarCenter` expect a Date object as second argument', newCenter instanceof Date);
  const calendarComponent = findComponentInstance(selector, rootElement);
  const onCenterChange = calendarComponent.args.onCenterChange;
  assert("You cannot call `calendarCenter` on a component that doesn't has an `@onCenterChange` action", !!onCenterChange);
  const publicAPI = calendarComponent.publicAPI;
  await publicAPI.actions.changeCenter(newCenter, publicAPI, {});
  return settled();
}
async function calendarSelect(selector, selected, rootElement) {
  assert('`calendarSelect` expect a Date object as second argument', selected);
  const calendarElement = findCalendarElement(selector, rootElement);
  const daySelector = `${selector} [data-date="${formatDate(selected, 'YYYY-MM-DD')}"]`;
  let dayElement = calendarElement?.querySelector(daySelector);
  if (!dayElement) {
    await calendarCenter(selector, selected, rootElement);
  }
  dayElement = calendarElement?.querySelector(daySelector);
  if (!dayElement) {
    return;
  }
  return click(dayElement);
}

export { calendarCenter, calendarSelect, helpers as default, formatDate };
//# sourceMappingURL=helpers.js.map
