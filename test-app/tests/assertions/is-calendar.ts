import ownProp from 'test-app/utils/own-prop';
import type { PowerCalendarAPI } from 'ember-power-calendar/components/power-calendar';

export default function isCalendar(this: Assert, calendar: PowerCalendarAPI, message: string) {
  const result =
    !!calendar &&
    ownProp(calendar, 'center') &&
    typeof calendar.loading === 'boolean' &&
    ownProp(calendar, 'locale') &&
    ownProp(calendar, 'selected') &&
    ownProp(calendar, 'uniqueId') &&
    ownProp(calendar, 'actions');

  this.pushResult({
    result,
    actual: result,
    expected: true,
    message,
  });
}
