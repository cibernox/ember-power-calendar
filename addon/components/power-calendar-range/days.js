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
      day.isRangeEnd = !day.isRangeStart && dayMoment.isSame(end, 'day');
    } else {
      day.isRangeStart = day.isSelected = dayMoment.isSame(start, 'day');
      day.isRangeEnd = false;
    }
    return day;
  },

  dayIsSelected() {
    return false;
  }
});
