import Controller from '@ember/controller';
import { computed } from '@ember/object';
import {
  add,
  isBefore,
  startOf,
  endOf,
  weekday
} from 'ember-power-calendar-utils';

export default Controller.extend({
  wedding: new Date(2013, 9, 18),
  minDate: new Date(2013, 9, 11),
  maxDate: new Date(2013, 9, 21),
  center: new Date(2013, 9, 15),
  disabledDates: [
    new Date(2013, 9, 18),
    new Date(2013, 9, 21),
    new Date(2013, 9, 22),
    new Date(2013, 9, 28)
  ],

  days: computed(function() {
    let now = new Date();
    let day = startOf(startOf(now, 'month'), 'isoWeek');
    let lastDay = endOf(endOf(now, 'month'), 'isoWeek');
    let days = [];
    while (isBefore(day, lastDay)) {
      if (weekday(day) !== 1 && weekday(day) !== 3) { // Skip Mon/Wed
        let copy = new Date(day);
        let isCurrentMonth = copy.getMonth() === now.getMonth();
        days.push({
          date: copy,
          isCurrentMonth
        });
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
