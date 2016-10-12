import layout from '../templates/components/power-calendar';
import Component from 'ember-component';
import computed from 'ember-computed';
import moment from 'moment';
import { scheduleOnce } from 'ember-runloop';

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
      let selected = this.get('selected');
      this.set('date', selected ? selected.clone() : moment());
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

  days: computed('monthNumber', 'selected', 'focusedDate', function() {
    let today = moment();
    let monthNumber = this.get('monthNumber');
    let month = moment().month(monthNumber);
    let beginOfMonth = month.clone().startOf('month');
    let startOfFirstWeek = beginOfMonth.clone().startOf('isoWeek');
    let endOfMonth = month.clone().endOf('month');
    let endOfLastWeek = endOfMonth.clone().endOf('isoWeek');
    let currentMoment = startOfFirstWeek.clone();
    let selected = this.get('selected');
    let focusedDate = this.get('focusedDate');
    let days = [];
    while (currentMoment.isBefore(endOfLastWeek)) {
      let date = currentMoment.format('YYYY-MM-DD');
      let momentDate = currentMoment.clone();
      days.push({
        date,
        number: currentMoment.date(),
        moment: momentDate,
        isFocused: focusedDate === date,
        isCurrentMonth: currentMoment.month() === monthNumber,
        isToday: currentMoment.isSame(today, 'day'),
        isSelected: selected ? currentMoment.isSame(selected, 'day') : false,
      });
      currentMoment.add(1, 'day');
    }
    return days;
  }),

  weeks: computed('days', function() {
    let days = this.get('days');
    let weeks = [];
    let i = 0;
    while (days[i]) {
      weeks.push({
        id: days[0].moment.format('YYYY-w'),
        days: days.slice(i, i + 7)
      });
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
        // debugger;
        action(day, e);
      }
    },

    onFocusDay(day) {
      this.set('focusedDate', day.date);
    },

    onBlurDay() {
      this.set('focused', null);
    },

    onKeyDown(e) {
      let focusedDate = this.get('focusedDate');
      if (focusedDate) {
        let days = this.get('days');
        let day, index;
        for (let i = 0; i < days.length; i++) {
          if (days[i].date === focusedDate) {
            index = i;
            break;
          }
        }
        if (e.keyCode === 38) {
          day = days[Math.max(index - 7, 0)];
        } else if (e.keyCode === 40) {
          day = days[Math.min(index + 7, days.length - 1)];
        } else if (e.keyCode === 37) {
          day = days[Math.max(index - 1, 0)];
        } else if (e.keyCode === 39) {
          day = days[Math.min(index + 1, days.length - 1)];
        } else {
          return;
        }
        this.set('focusedDate', day.date);
        scheduleOnce('afterRender', this, '_focusDate', day.date);
      }
    }
  },

  // Methods
  _focusDate(date) {
    let dayElement = this.element.querySelector(`[data-date="${date}"]`);
    if (dayElement) {
      dayElement.focus();
    }
  }
});
