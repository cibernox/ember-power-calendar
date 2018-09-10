import { getProperties, get } from '@ember/object';
import { isBetween, isSame, diff } from 'ember-power-calendar-utils';

export default {
  // Methods
  buildPeriod(date, currentDate, calendar) {
    const periodObj = this._super(...arguments);
    const { start, end } = getProperties(calendar.selected || { start: null, end: null }, 'start', 'end');
    const period = get(this, 'period');

    if (start && end) {
      periodObj.isRangeStart = periodObj.isSelected && isSame(date, start, period);
      periodObj.isRangeEnd = periodObj.isSelected && isSame(date, end, period);
    } else {
      periodObj.isRangeEnd = false;
      if (!start) {
        periodObj.isRangeStart = false;
      } else {
        periodObj.isRangeStart = periodObj.isSelected = isSame(date, start, period);
        if (!periodObj.isDisabled) {
          let diffInMs = Math.abs(diff(periodObj.date, start));
          periodObj.isDisabled = diffInMs < calendar.minRange
            || calendar.maxRange !== null && diffInMs > calendar.maxRange;
        }
      }
    }

    return periodObj;
  },

  isSelected(date, calendar = this.get('calendar')) {
    const { start, end } = getProperties(calendar.selected || { start: null, end: null }, 'start', 'end');
    const period = get(this, 'period');

    return start && (
      isSame(date, start, period) || end && (
        isSame(date, end, period) || isBetween(date, start, end, period, '[]')
      )
    );
  }
};
