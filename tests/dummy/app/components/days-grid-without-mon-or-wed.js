import Component from '@ember/component';
import { computed } from '@ember/object';
import { add, isBefore, startOf, endOf, weekday } from 'ember-power-calendar/utils/date-utils';

export default Component.extend({
  days: computed(function() {
    let now = new Date();
    let day = startOf(startOf(now, 'month'), 'isoWeek');
    let lastDay = endOf(endOf(now, 'month'), 'isoWeek');
    let days = [];
    while (isBefore(day, lastDay)) {
      if (weekday(day) !== 1 && weekday(day) !== 3) { // Skip Mon/Wed
        let copy = new Date(day)
        let isCurrentMonth = copy.getMonth() === now.getMonth();
        days.push({ date: copy, isCurrentMonth });
      }
      day = add(day, 1, 'day');
    }
    return days;
  }),

  weeksWithoutMondaysOrWednesday: computed('noMondays', function() {
    let days = this.get('days');
    let weeks = [];
    let i = 0;
    while (days[i]) {
      weeks.push({ days: days.slice(i, i + 5) });
      i += 5;
    }
    return weeks;
  })
});
