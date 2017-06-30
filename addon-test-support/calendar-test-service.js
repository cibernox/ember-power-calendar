import { assert } from 'ember-metal/utils';
import { find } from 'ember-native-dom-helpers';

class CalendarTestService {
  setCalendarService(service) {
    this.calendarService = service;
  }

  findComponentInstance(selector) {
    let calendarGuid = this.findCalendarGuid(selector);
    assert(
      `Could not find a calendar using selector: "${selector}"`,
      calendarGuid
    );
    return this.calendarService._calendars[calendarGuid];
  }

  findCalendarGuid(selector) {
    let maybeCalendar = this.findCalendarElement(selector);
    if (!maybeCalendar) {
      return;
    }
    if (maybeCalendar.classList.contains('ember-power-calendar')) {
      return maybeCalendar.id;
    } else {
      return maybeCalendar.attributes['data-power-calendar-id'].value;
    }
  }

  findCalendarElement(selector) {
    let target = find(selector);
    if (target) {
      if (target.classList.contains('ember-power-calendar')) {
        return target;
      } else {
        return (
          find('.ember-power-calendar', target)
          || find('[data-power-calendar-id]', target)
        );
      }
    }
  }
}

let calendarService = new CalendarTestService();
let findComponentInstance = calendarService.findComponentInstance.bind(
  calendarService
);
let findCalendarElement = calendarService.findCalendarElement.bind(
  calendarService
);

export { findComponentInstance, findCalendarElement };
export default calendarService;
