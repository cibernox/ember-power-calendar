import Component from 'ember-component';
import layout from '../../templates/components/power-calendar/days';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import { scheduleOnce } from 'ember-runloop';
import moment from 'moment';

export default Component.extend({
  layout,
  focusedId: null,
  showDaysAround: true,
  clockService: service('power-calendar-clock'),

  // CPs
  dayNamesAbbrs: computed('locale', function() {
    let locale = this.get('locale'); // Maybe calendar.locale?
    let ary = [];
    if (locale) {
      moment.locale(locale);
      ary = moment.weekdaysShort();
      moment.locale(false);
    } else {
      ary = moment.weekdaysShort();
    }
    return ary;
  }),

  startOfWeek: computed({
    get() {
      return 1;
    },
    set(_, v) {
      return v == null ? 1 : parseInt(v, 10);
    }
  }),

  weekDaysAbbrs: computed('startOfWeek', function() {
    let { startOfWeek, dayNamesAbbrs } = this.getProperties('startOfWeek', 'dayNamesAbbrs');
    return dayNamesAbbrs.slice(startOfWeek).concat(dayNamesAbbrs.slice(0, startOfWeek));
  }),

  days: computed('calendar.{center,selected}', 'focusedId', 'startOfWeek', 'minDate', 'maxDate', function() {
    let today = this.get('clockService').getDate();
    let calendar = this.get('calendar');
    let lastDay = this.lastDay(calendar);
    let currentMoment = this.firstDay(calendar);
    let days = [];
    while (currentMoment.isBefore(lastDay)) {
      days.push(this.buildDay(currentMoment, today, calendar));
      currentMoment.add(1, 'day');
    }
    return days;
  }),

  weeks: computed('showDaysAround', 'days', function() {
    let { showDaysAround, days } = this.getProperties('showDaysAround', 'days');
    let weeks = [];
    let i = 0;
    while (days[i]) {
      let daysOfWeek = days.slice(i, i + 7);
      if (!showDaysAround) {
        daysOfWeek = daysOfWeek.filter((d) => d.isCurrentMonth);
      }
      weeks.push({
        id: days[0].moment.format('YYYY-w'),
        days: daysOfWeek,
        missingDays: 7 - daysOfWeek.length
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
          let newIndex = Math.max(index - 7, 0);
          day = days[newIndex];
          if (day.isDisabled) {
            for (let i = newIndex + 1; i <= index; i++) {
              day = days[i];
              if (!day.isDisabled) {
                break;
              }
            }
          }
        } else if (e.keyCode === 40) {
          e.preventDefault();
          let newIndex = Math.min(index + 7, days.length - 1);
          day = days[newIndex];
          if (day.isDisabled) {
            for (let i = newIndex - 1; i >= index; i--) {
              day = days[i];
              if (!day.isDisabled) {
                break;
              }
            }
          }
        } else if (e.keyCode === 37) {
          day = days[Math.max(index - 1, 0)];
          if (day.isDisabled) {
            return;
          }
        } else if (e.keyCode === 39) {
          day = days[Math.min(index + 1, days.length - 1)];
          if (day.isDisabled) {
            return;
          }
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
    let isDisabled = !this.get('onSelect');
    if (!isDisabled) {
      let minDate = this.get('minDate');
      if (minDate && momentDate.isBefore(minDate)) {
        isDisabled = true;
      }
      if (!isDisabled) {
        let maxDate = this.get('maxDate');
        if (maxDate && momentDate.isAfter(maxDate)) {
          isDisabled = true;
        }
      }
    }
    return {
      id,
      number: momentDate.date(),
      date: momentDate._d,
      moment: momentDate,
      isDisabled,
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

  firstDay(calendar) {
    let firstDay = calendar.center.clone().startOf('month');
    let startOfWeek = this.get('startOfWeek');
    while (firstDay.weekday() !== startOfWeek) {
      firstDay.add(-1, 'day');
    }
    return firstDay;
  },

  lastDay(calendar) {
    let startOfWeek = this.get('startOfWeek');
    let lastDay = calendar.center.clone().endOf('month');
    while (lastDay.weekday() !== (startOfWeek + 6) % 7) {
      lastDay.add(1, 'day');
    }
    return lastDay;
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
