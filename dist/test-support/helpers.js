import { run } from '@ember/runloop';
import { assert } from '@ember/debug';
import { settled, click, find } from '@ember/test-helpers';
import { formatDate } from '../utils.js';
export { add, diff, endOf, endOfWeek, getDefaultLocale, getWeekdays, getWeekdaysMin, getWeekdaysShort, isAfter, isBefore, isBetween, isSame, isoWeekday, localeStartOfWeek, normalizeCalendarDay, normalizeCalendarValue, normalizeDate, normalizeDuration, normalizeMultipleActionValue, normalizeRangeActionValue, registerDateLibrary, startOf, startOfWeek, weekday, withLocale } from '../utils.js';

var helpers = {};
function findCalendarElement(selector) {
  const target = find(selector);
  if (target) {
    if (target.classList.contains('ember-power-calendar')) {
      return target;
    } else {
      return target.querySelector('.ember-power-calendar') || target.querySelector('[data-power-calendar-id]');
    }
  }
}
function findCalendarGuid(selector) {
  const maybeCalendar = findCalendarElement(selector);
  if (!maybeCalendar) {
    return;
  }
  if (maybeCalendar.classList.contains('ember-power-calendar')) {
    return maybeCalendar.id;
  } else {
    return maybeCalendar.dataset['powerCalendarId'];
  }
}
function findComponentInstance(selector) {
  const calendarGuid = findCalendarGuid(selector);
  assert(`Could not find a calendar using selector: "${selector}"`, calendarGuid);
  // @ts-expect-error Property '__powerCalendars'
  return window.__powerCalendars[calendarGuid];
}
async function calendarCenter(selector, newCenter) {
  assert('`calendarCenter` expect a Date object as second argument', newCenter instanceof Date);
  const calendarComponent = findComponentInstance(selector);
  const onCenterChange = calendarComponent.args.onCenterChange;
  assert("You cannot call `calendarCenter` on a component that doesn't has an `@onCenterChange` action", !!onCenterChange);
  const publicAPI = calendarComponent.publicAPI;
  run(() => publicAPI.actions.changeCenter(newCenter, publicAPI, {}));
  return settled();
}
async function calendarSelect(selector, selected) {
  assert('`calendarSelect` expect a Date object as second argument', selected);
  const calendarElement = findCalendarElement(selector);
  const daySelector = `${selector} [data-date="${formatDate(selected, 'YYYY-MM-DD')}"]`;
  const dayElement = calendarElement?.querySelector(daySelector);
  if (!dayElement) {
    await calendarCenter(selector, selected);
  }
  return click(daySelector);
}

export { calendarCenter, calendarSelect, helpers as default, formatDate };
//# sourceMappingURL=helpers.js.map
