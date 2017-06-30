import moment from 'moment';
import { assert } from 'ember-metal/utils';
import { click, find } from 'ember-native-dom-helpers';
import findCalendarElement from './-utils/find-calendar-element';
import { calendarCenter } from 'ember-power-calendar/test-support';

let calendarSelect = async function(app, selector, selected) {
  assert(
    '`calendarSelect` expect a Date or MomentJS object as second argument',
    selected
  );
  let selectedMoment = moment(selected);
  let calendarElement = findCalendarElement(selector);
  let daySelector = `${selector} [data-date="${selectedMoment.format(
    'YYYY-MM-DD'
  )}"]`;
  let dayElement = find(daySelector, calendarElement);
  if (!dayElement) {
    await calendarCenter(app, selector, selected);
  }
  return click(daySelector);
};

export default calendarSelect;
