import type { PowerCalendarAPI } from '../components/power-calendar.ts';
import type { Week } from '../-private/days-utils.ts';
import type { PowerCalendarDay } from '../utils.ts';

export default function emberPowerCalendarDayClasses(
  day: PowerCalendarDay,
  calendar: PowerCalendarAPI,
  weeks: Week[],
  dayClass:
    | string
    | ((
        day: PowerCalendarDay,
        calendar: PowerCalendarAPI,
        weeks: Week[],
      ) => string)
    | undefined,
): string {
  const classes = ['ember-power-calendar-day'];
  if (calendar.actions.select) {
    classes.push('ember-power-calendar-day--interactive');
  }
  classes.push(
    `ember-power-calendar-day--${
      day.isCurrentMonth ? 'current' : 'other'
    }-month`,
  );
  if (day.isSelected) {
    classes.push('ember-power-calendar-day--selected');
  }
  if (day.isToday) {
    classes.push('ember-power-calendar-day--today');
  }
  if (day.isFocused) {
    classes.push('ember-power-calendar-day--focused');
  }
  if (day.isRangeStart) {
    classes.push('ember-power-calendar-day--range-start');
  }
  if (day.isRangeEnd) {
    classes.push('ember-power-calendar-day--range-end');
  }
  if (dayClass) {
    if (typeof dayClass === 'string') {
      classes.push(dayClass);
    } else if (typeof dayClass === 'function') {
      const k = dayClass(day, calendar, weeks);
      if (k !== null && k !== undefined) {
        classes.push(k);
      }
    }
  }
  return classes.join(' ');
}
