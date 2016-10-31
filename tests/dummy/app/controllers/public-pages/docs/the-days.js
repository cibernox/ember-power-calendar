import Controller from 'ember-controller';
import computed from 'ember-computed';
import moment from 'moment';

export default Controller.extend({
  wedding: moment('2013-10-18'),
  minDate: moment('2013-10-11'),
  maxDate: moment('2013-10-21'),

  days: computed(function() {
    let now = moment();
    let day = now.clone().startOf('month').startOf('isoWeek');
    let lastDay = now.clone().endOf('month').endOf('isoWeek');
    let days = [];
    while (day.isBefore(lastDay)) {
      if (day.weekday() !== 1 && day.weekday() !== 3) { // Skip Mon/Wed
        let copy = day.clone();
        let isCurrentMonth = copy.month() === now.month();
        days.push({ date: copy._d, moment: copy, isCurrentMonth });
      }
      day.add(1, 'day');
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