import { run } from '@ember/runloop';
import { assert } from '@ember/debug';
import wait from 'ember-test-helpers/wait';
import { find, click } from 'ember-native-dom-helpers';
import { formatDate } from 'ember-power-calendar/utils/date-utils';

function findCalendarElement(selector) {
  let target = find(selector);
  if (target) {
    if (target.classList.contains('ember-power-calendar')) {
      return target;
    } else {
      return find('.ember-power-calendar', target) || find('[data-power-calendar-id]', target);
    }
  }
}

function findCalendarGuid(selector) {
  let maybeCalendar = findCalendarElement(selector);
  if (!maybeCalendar) {
    return;
  }
  if (maybeCalendar.classList.contains('ember-power-calendar')) {
    return maybeCalendar.id;
  } else {
    return maybeCalendar.attributes['data-power-calendar-id'].value;
  }
}

function findComponentInstance(selector) {
  let calendarGuid = findCalendarGuid(selector);
  assert(`Could not find a calendar using selector: "${selector}"`, calendarGuid);
  return window.__powerCalendars[calendarGuid];
}

export async function calendarCenter(selector, newCenter) {
  assert('`calendarCenter` expect a Date object as second argument', newCenter instanceof Date);
  let calendarComponent = findComponentInstance(selector);
  let onCenterChange = calendarComponent.get('onCenterChange');
  assert('You cannot call `calendarCenter` on a component that doesn\'t has an `onCenterChange` action', !!onCenterChange);
  let publicAPI = calendarComponent.get('publicAPI');
  await run(() => publicAPI.actions.changeCenter(newCenter, publicAPI));
  return wait();
}

export async function calendarSelect(selector, selected) {
  assert('`calendarSelect` expect a Date or MomentJS object as second argument', selected);
  let calendarElement = findCalendarElement(selector);
  let daySelector = `${selector} [data-date="${formatDate(selected, 'YYYY-MM-DD')}"]`;
  let dayElement = find(daySelector, calendarElement);
  if (!dayElement) {
    await calendarCenter(selector, selected);
  }
  return click(daySelector);
}
