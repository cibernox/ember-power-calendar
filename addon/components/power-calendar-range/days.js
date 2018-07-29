import { getProperties } from '@ember/object';
import DaysComponent from '../power-calendar/days';
import { isBetween, isSame } from 'ember-power-calendar/utils/date-utils';

export default DaysComponent.extend({
  // Methods
  buildDay(date, today, calendar) {
    let day = this._super(...arguments);
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
          let diff = Math.abs(day.moment.diff(start));
          day.isDisabled = diff < calendar.minRange.as('ms')
            || calendar.maxRange !== null && diff > calendar.maxRange.as('ms');
        }
      }
    }
    return day;
  },

  dayIsSelected() {
    return false;
  }
});
