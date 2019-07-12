import { getProperties } from '@ember/object';
import DaysComponent from '../power-calendar/days';
import { isBetween, isSame, diff } from 'ember-power-calendar-utils';

export default class extends DaysComponent {
  // Methods
  buildDay(date, today, calendar) {
    let day = super.buildDay(...arguments);
    let { start, end } = getProperties(calendar.selected || { start: null, end: null }, 'start', 'end');
    if (start && end) {
      day.isSelected = isBetween(date, start, end, 'day', '[]');
      day.isRangeStart = day.isSelected && isSame(date, start, 'day');
      day.isRangeEnd = day.isSelected && isSame(date, end, 'day');
    } else {
      day.isRangeEnd = false;
      if (!start) {
        day.isRangeStart = false;
      } else {
        day.isRangeStart = day.isSelected = isSame(date, start, 'day');
        if (!day.isDisabled) {
          let diffInMs = Math.abs(diff(day.date, start));
          day.isDisabled = diffInMs < calendar.minRange
            || calendar.maxRange !== null && diffInMs > calendar.maxRange;
        }
      }
    }
    return day;
  }

  dayIsSelected() {
    return false;
  }
}
