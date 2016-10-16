import layout from '../templates/components/power-calendar';
import Component from 'ember-component';
import computed from 'ember-computed';
import moment from 'moment';
import { scheduleOnce } from 'ember-runloop';
import service from 'ember-service/inject';

export default Component.extend({
  layout,
  classNames: ['ember-power-calendar'],
  displayedMonth: null,
  selected: null,
  focusedId: null,
  calendar: service(),

  // CPs
  publicAPI: computed(function() {
    return {
      actions: {
        decreaseMonth: () => this.send('decreaseMonth'),
        increaseMonth: () => this.send('increaseMonth')
      }
    };
  }),

  dayNames: computed(function() {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }),

  currentlyDisplayedMonth: computed('displayedMonth', 'selected', function() {
    return moment(this.get('displayedMonth') || this.get('selected') || this.get('calendar').getDate());
  }),

  days: computed('monthNumber', 'selected', 'focusedId', function() {
    let today = this.get('calendar').getDate();
    let displayedMonth = this.get('currentlyDisplayedMonth');
    let beginOfMonth = displayedMonth.clone().startOf('month');
    let startOfFirstWeek = beginOfMonth.clone().startOf('isoWeek');
    let endOfMonth = displayedMonth.clone().endOf('month');
    let endOfLastWeek = endOfMonth.clone().endOf('isoWeek');
    let currentMoment = startOfFirstWeek.clone();
    let selected = this.get('selected');
    let focusedId = this.get('focusedId');
    let days = [];
    while (currentMoment.isBefore(endOfLastWeek)) {
      let id = currentMoment.format('YYYY-MM-DD');
      let momentDate = currentMoment.clone();
      days.push({
        id,
        number: currentMoment.date(),
        date: momentDate._d,
        moment: momentDate,
        isFocused: focusedId === id,
        isCurrentMonth: currentMoment.month() === displayedMonth.month(),
        isToday: currentMoment.isSame(today, 'day'),
        isSelected: selected ? currentMoment.isSame(selected, 'day') : false
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
      let displayedMonth = this.get('displayedMonth');
      let momentDate = moment(displayedMonth);
      let previousMonth = momentDate.clone().subtract(1, 'month');
      let newMonth = previousMonth instanceof Date ? previousMonth._d : previousMonth;
      this.get('onMonthChange')(newMonth);
    },

    increaseMonth() {
      let displayedMonth = this.get('displayedMonth');
      let momentDate = moment(displayedMonth);
      let previousMonth = momentDate.clone().add(1, 'month');
      let newMonth = previousMonth instanceof Date ? previousMonth._d : previousMonth;
      this.get('onMonthChange')(newMonth);
    },

    clickDay(day, e) {
      let action = this.get('onChange');
      if (action) {
        action(day, e);
      }
    },

    onFocusDay(day) {
      scheduleOnce('actions', this, this._updateFocused, day.id);
    },

    onBlurDay() {
      scheduleOnce('actions', this, this._updateFocused, null);
    },

    onKeyDown(e) {
      let focusedId = this.get('focusedId');
      if (focusedId) {
        let days = this.get('days');
        let day, index;
        for (let i = 0; i < days.length; i++) {
          if (days[i].id === focusedId) {
            index = i;
            break;
          }
        }
        if (e.keyCode === 38) {
          e.preventDefault();
          day = days[Math.max(index - 7, 0)];
        } else if (e.keyCode === 40) {
          e.preventDefault();
          day = days[Math.min(index + 7, days.length - 1)];
        } else if (e.keyCode === 37) {
          day = days[Math.max(index - 1, 0)];
        } else if (e.keyCode === 39) {
          day = days[Math.min(index + 1, days.length - 1)];
        } else {
          return;
        }
        this.set('focusedId', day.id);
        scheduleOnce('afterRender', this, '_focusDate', day.id);
      }
    }
  },

  // Methods
  _updateFocused(id) {
    this.set('focusedId', id);
  },

  _focusDate(id) {
    let dayElement = this.element.querySelector(`[data-date="${id}"]`);
    if (dayElement) {
      dayElement.focus();
    }
  }
});
