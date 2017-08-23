import Test from 'ember-test';
import { deprecate } from '@ember/application/deprecations';
import { calendarSelect, calendarCenter, initCalendarHelpers } from 'ember-power-calendar/test-support';

export default function() {
  Test.registerAsyncHelper('calendarCenter', function(app, selector, newCenter) {
    deprecate(
      "The implicit usage of `calendarCenter` will be soon removed. Please switch to `import { calendarCenter } from 'ember-power-calendar/test-support'`",
      false,
      { id: 'ember-power-calendar.test-helpers.calendarCenter', until: '1.0.0' }
    );
    initCalendarHelpers(app.__container__);
    return calendarCenter(selector, newCenter);
  });

  Test.registerAsyncHelper('calendarSelect', function(app, selector, selected) {
    deprecate(
      "The implicit usage of `calendarSelect` will be soon removed. Please switch to `import { calendarSelect } from 'ember-power-calendar/test-support'`",
      false,
      { id: 'ember-power-calendar.test-helpers.calendarSelect', until: '1.0.0' }
    );
    initCalendarHelpers(app.__container__);
    return calendarSelect(selector, selected);
  });
}
