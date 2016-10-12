import layout from '../templates/components/power-calendar';
import Component from 'ember-component';
import computed from 'ember-computed';
import moment from 'moment';

export default Component.extend({
  layout,
  onlyCurrent: false,
  monthNumber: 0,
  // CPs
  monthName: computed('monthNumber', function() {
    return moment().month(this.get('monthNumber')).format('MMMM');
  }),

  weeks: computed('monthNumber', function() {
    let monthNumber = this.get('monthNumber');
    let month = moment().month(monthNumber);
    let beginOfMonth = month.clone().startOf('month');
    let startOfFirstWeek = beginOfMonth.clone().startOf('isoWeek');
    let endOfMonth = month.clone().endOf('month');
    let endOfLastWeek = endOfMonth.clone().endOf('isoWeek');
    let currentMoment = startOfFirstWeek.clone();
    let days = [];
    while (currentMoment.isBefore(endOfLastWeek)) {
      days.push({
        number: currentMoment.date(),
        currentMonth: currentMoment.month() === monthNumber
      });
      currentMoment.add(1, 'day');
    }
    let weeks = new Array(days.length / 7);
    let i = 0;
    while (days[i]) {
      weeks[i] = days.slice(i, i + 7);
      i += 7;
    }
    return weeks;
  }),

  // Actions
  actions: {
    prev() {
      let newNumber = this.get('monthNumber') - 1;
      if (newNumber < 0) {
        newNumber += 11;
      }
      this.set('monthNumber', newNumber);
    },
    next() {
      let newNumber = this.get('monthNumber') + 1 % 11;
      this.set('monthNumber', newNumber);
    }
  }
});
