import Test from 'ember-test';
import { assert } from 'ember-metal/utils';
import moment from 'moment';
import { find, click } from 'ember-native-dom-helpers';
import wait from 'ember-test-helpers/wait';

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

function findComponentInstance(app, selector) {
  let calendarGuid = findCalendarGuid(selector);
  assert(`Could not find a calendar using selector: "${selector}"`, calendarGuid);
  let calendarService = app.__container__.lookup('service:power-calendar');
  return calendarService._calendars[calendarGuid];
}

export default function() {
  Test.registerAsyncHelper('calendarCenter', async function(app, selector, newCenter) {
    assert('`calendarCenter` expect a Date or MomentJS object as second argument', newCenter);
    let calendarComponent = findComponentInstance(app, selector);
    let onCenterChange = calendarComponent.get('onCenterChange');
    assert('You cannot call `calendarCenter` on a component that doesn\'t has an `onCenterChange` action', !!onCenterChange);
    let publicAPI = calendarComponent.get('publicAPI');
    await publicAPI.actions.changeCenter(newCenter, publicAPI);
    return wait();
  });

  Test.registerAsyncHelper('calendarSelect', async function(app, selector, selected) {
    assert('`calendarSelect` expect a Date or MomentJS object as second argument', selected);
    let selectedMoment = moment(selected);
    let calendarElement = findCalendarElement(selector);
    let daySelector = `${selector} [data-date="${selectedMoment.format('YYYY-MM-DD')}"]`;
    let dayElement = find(daySelector, calendarElement);
    if (!dayElement) {
      await calendarCenter(selector, selected);
    }
    return click(daySelector);
  });
}
