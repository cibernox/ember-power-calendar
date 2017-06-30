import { initCalendarHelpers } from 'ember-power-calendar/test-support';

export function initialize(application) {
  initCalendarHelpers(application.__container__);
}

export default {
  name: 'ember-power-calendar-test',
  initialize
};
