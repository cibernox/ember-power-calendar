import layout from '../templates/components/power-calendar';
import Component from 'ember-component';
import computed from 'ember-computed';
import moment from 'moment';

export default Component.extend({
  layout,
  classNames: ['ember-power-calendar'],
  date: null,
  onlyCurrent: false,
  monthNumber: 9,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    let date = this.get('date');
    if (!date) {
      this.set('date', moment());
    }
    this.publicAPI = {
      actions: {
        decreaseMonth: () => this.send('decreaseMonth'),
        increaseMonth: () => this.send('increaseMonth')
      }
    }
  },

  // CPs
  monthNumber: computed('date', function() {
    return this.get('date').month();
  }),

  dayNames: computed(function() {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }),

  weeks: computed('monthNumber', function() {
    let today = moment();
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
        isCurrentMonth: currentMoment.month() === monthNumber,
        isToday: currentMoment.isSame(today, 'day')
      });
      currentMoment.add(1, 'day');
    }
    let weeks = [];
    let i = 0;
    while (days[i]) {
      weeks.push({ days: days.slice(i, i + 7) });
      i += 7;
    }
    return weeks;
  }),

  // Actions
  actions: {
    decreaseMonth() {
      this.set('date', this.get('date').clone().subtract(1, 'month'));
    },

    increaseMonth() {
      this.set('date', this.get('date').clone().add(1, 'month'));
    },

    clickDay(day, e) {
      let action = this.get('onchange');
      if (action) {
        action(day, e);
      }
    }
  }
});
