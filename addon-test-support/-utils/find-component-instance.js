import findCalendarGuid from './find-calendar-guid';
import { assert } from 'ember-metal/utils';

function findComponentInstance(app, selector) {
  let calendarGuid = findCalendarGuid(selector);
  assert(
    `Could not find a calendar using selector: "${selector}"`,
    calendarGuid
  );
  let calendarService = app.__container__.lookup('service:power-calendar');
  return calendarService._calendars[calendarGuid];
}

export default findComponentInstance;
