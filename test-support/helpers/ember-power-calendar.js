import { registerAsyncHelper } from '@ember/test';
import { calendarCenter, calendarSelect } from 'ember-power-calendar/test-support';

export default function() {
  registerAsyncHelper('calendarCenter', async function(app, selector, newCenter) {
    return calendarCenter(selector, newCenter);
  });

  registerAsyncHelper('calendarSelect', async function(app, selector, selected) {
    return calendarSelect(selector, selected);
  });
}
