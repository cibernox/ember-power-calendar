import DaysComponent from '../power-calendar/days';
import moment from 'moment';
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
  },

  buildOnChangeValue(day) {
    let selected = this.get('calendar.selected') || { start: null, end: null };
    let { start, end } = getProperties(selected, 'start', 'end');
    if (start && !end) {
      let startMoment = moment(start);
      if (startMoment.isAfter(day.moment)) {
        return {
          moment: { start: day.moment, end: startMoment },
          date: {  start: day.date, end: startMoment._d }
        };
      }  else {
        return {
          moment: { start: startMoment, end: day.moment },
          date: {  start: startMoment._d, end: day.date }
        };
      }
    } else {
      return {
        moment: { start: day.moment, end: null },
        date: {  start: day.date, end: null }
      };
    }
  }
});
