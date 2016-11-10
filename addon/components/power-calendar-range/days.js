import DaysComponent from '../power-calendar/days';
import { getProperties } from 'ember-metal/get';

export default DaysComponent.extend({
  // Methods
  buildDay(dayMoment, today, calendar) {
    let day = this._super(...arguments);
    let { start, end } = getProperties(calendar.selected || { start: null, end: null }, 'start', 'end');
    if (start && end) {
      day.isSelected = dayMoment.isBetween(start, end, 'day', '[]');
      day.isRangeStart = day.isSelected && dayMoment.isSame(start, 'day');
      day.isRangeEnd = day.isSelected && dayMoment.isSame(end, 'day');
    } else {
      day.isRangeEnd = false;
      if (!start) {
        day.isRangeStart = false;
      } else {
        day.isRangeStart = day.isSelected = dayMoment.isSame(start, 'day');
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
