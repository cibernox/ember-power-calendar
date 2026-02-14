import type { PowerCalendarAPI } from 'ember-power-calendar/components/power-calendar';

export default function isCalendar(
  this: Assert,
  calendar: PowerCalendarAPI,
  message: string,
) {
  const result =
    !!calendar &&
    'center' in calendar &&
    typeof calendar.loading === 'boolean' &&
    'locale' in calendar &&
    'selected' in calendar &&
    'uniqueId' in calendar &&
    'actions' in calendar;

  this.pushResult({
    result,
    actual: result,
    expected: true,
    message,
  });
}
