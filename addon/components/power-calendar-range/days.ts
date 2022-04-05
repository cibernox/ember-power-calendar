import { diff, isBetween, isSame } from 'ember-power-calendar-utils';
import { PowerCalendarRangeAPI } from 'ember-power-calendar/components/power-calendar-range';

import DaysComponent from '../power-calendar/days';

export default class PowerCalendarDaysRange extends DaysComponent {
  // Methods
  buildDay(date: Date, today: Date, calendar: PowerCalendarRangeAPI) {
    const day = super.buildDay(date, today, calendar);

    const { start, end } = calendar.selected ?? { start: null, end: null };

    if (start && end) {
      day.isSelected = isBetween(date, start, end, "day", "[]");
      day.isRangeStart = day.isSelected && isSame(date, start, "day");
      day.isRangeEnd = day.isSelected && isSame(date, end, "day");
    } else {
      day.isRangeEnd = false;
      if (!start) {
        day.isRangeStart = false;
      } else {
        day.isRangeStart = day.isSelected = isSame(date, start, "day");
        if (!day.isDisabled) {
          const diffInMs = Math.abs(diff(day.date, start));
          const minRange = calendar.minRange;
          const maxRange = calendar.maxRange;

          day.isDisabled =
            (minRange && diffInMs < minRange) ||
            (maxRange !== null &&
              maxRange !== undefined &&
              diffInMs > maxRange);
        }
      }
    }
    return day;
  }

  dayIsSelected() {
    return false;
  }
}
