import Component from 'ember-component';
import layout from '../../templates/components/power-calendar/days';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import { scheduleOnce } from 'ember-runloop';

export default Component.extend({
  layout,
  focusedId: null,
  clockService: service('power-calendar-clock'),

  // CPs
  dayNames: computed(function() {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }),

  days: computed('calendar.{center,selected}', 'focusedId', function() {
    let today = this.get('clockService').getDate();
    let calendar = this.get('calendar');
    let beginOfMonth = calendar.center.clone().startOf('month');
    let startOfFirstWeek = beginOfMonth.clone().startOf('isoWeek');
    let endOfMonth = calendar.center.clone().endOf('month');
    let endOfLastWeek = endOfMonth.clone().endOf('isoWeek');
    let currentMoment = startOfFirstWeek.clone();
    let days = [];
    while (currentMoment.isBefore(endOfLastWeek)) {
      days.push(this.buildDay(currentMoment, today, calendar));
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
  buildDay(dayMoment, today, calendar) {
    let id = dayMoment.format('YYYY-MM-DD');
    let momentDate = dayMoment.clone();
    return {
      id,
      number: momentDate.date(),
      date: momentDate._d,
      moment: momentDate,
      isFocused: this.get('focusedId') === id,
      isCurrentMonth: momentDate.month() === calendar.center.month(),
      isToday: momentDate.isSame(today, 'day'),
      isSelected: this.dayIsSelected(momentDate, calendar)
    };
  },

  buildonSelectValue(day) {
    return day;
  },

  dayIsSelected(dayMoment, calendar = this.get('calendar')) {
    return calendar.selected ? dayMoment.isSame(calendar.selected, 'day') : false;
  },

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
