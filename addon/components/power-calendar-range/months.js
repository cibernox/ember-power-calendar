import { getProperties } from '@ember/object';
import MonthsComponent from '../power-calendar/months';
import { isBetween, isSame, diff } from 'ember-power-calendar-utils';

export default MonthsComponent.extend({
  // Methods
  buildMonth(date, thisMonth, calendar) {
    let month = this._super(...arguments);
    let { start, end } = getProperties(calendar.selected || { start: null, end: null }, 'start', 'end');
    if (start && end) {
      month.isRangeStart = month.isSelected && isSame(date, start, 'month');
      month.isRangeEnd = month.isSelected && isSame(date, end, 'month');
    } else {
      month.isRangeEnd = false;
      if (!start) {
        month.isRangeStart = false;
      } else {
        month.isRangeStart = month.isSelected = isSame(date, start, 'month');
        if (!month.isDisabled) {
          let diffInMs = Math.abs(diff(month.date, start));
          month.isDisabled = diffInMs < calendar.minRange
            || calendar.maxRange !== null && diffInMs > calendar.maxRange;
        }
      }
    }
    return month;
  },

  isSelected(date, calendar = this.get('calendar')) {
    let { start, end } = getProperties(calendar.selected || { start: null, end: null }, 'start', 'end');

    return start && (
      isSame(date, start, 'month') || end && (
        isSame(date, end, 'month') || isBetween(date, start, end, 'month', '[]')
      )
    );
  }
});
