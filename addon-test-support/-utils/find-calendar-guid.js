import findCalendarElement from './find-calendar-element';

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

export default findCalendarGuid;
