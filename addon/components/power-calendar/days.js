import Component from 'ember-component';
import layout from '../../templates/components/power-calendar/days';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import { scheduleOnce } from 'ember-runloop';
import moment from 'moment';

function withLocale(locale, fn) {
  let returnValue;
  if (locale) {
    let previousLocale = moment.locale();
    moment.locale(locale);
    returnValue = fn();
    moment.locale(previousLocale);
  } else {
    returnValue = fn();
  }
  return returnValue;
}

export default Component.extend({
  layout,
  focusedId: null,
  showDaysAround: true,
  classNames: ['ember-power-calendar-days'],
  weekdayFormat: 'short', // "min" | "short" | "long"
  powerCalendarService: service('power-calendar'),
  attributeBindings: [
    'data-power-calendar-id'
  ],

  // CPs
  'data-power-calendar-id': computed.oneWay('calendar.uniqueId'),
  weekdaysMin: computed('calendar.locale', function() {
    return withLocale(this.get('calendar.locale'), () => moment.weekdaysMin());
  }),

  weekdaysShort: computed('calendar.locale', function() {
    return withLocale(this.get('calendar.locale'), () => moment.weekdaysShort());
  }),

  weekdays: computed('calendar.locale', function() {
    return withLocale(this.get('calendar.locale'), () => moment.weekdays());
  }),

  localeStartOfWeek: computed('weekdaysShort', 'startOfWeek', function() {
    let forcedStartOfWeek = this.get('startOfWeek');
    if (forcedStartOfWeek) {
      return parseInt(forcedStartOfWeek, 10);
    }
    let now = this.get('powerCalendarService').getDate();
    let dayAbbr = withLocale(this.get('calendar.locale'), () => moment(now).startOf('week').format('ddd'));
    return this.get('weekdaysShort').indexOf(dayAbbr);
  }),

  weekdaysNames: computed('localeStartOfWeek', 'weekdayFormat', 'calendar.locale', function() {
    let { localeStartOfWeek, weekdayFormat } = this.getProperties('localeStartOfWeek', 'weekdayFormat');
    let format = `weekdays${weekdayFormat === 'long' ? '' : (weekdayFormat === 'min' ? 'Min' : 'Short')}`;
    let weekdaysNames = this.get(format);
    return weekdaysNames.slice(localeStartOfWeek).concat(weekdaysNames.slice(0, localeStartOfWeek));
  }),

  days: computed('calendar', 'focusedId', 'localeStartOfWeek', 'minDate', 'maxDate', 'disabledDates.[]', 'maxLength', function() {
    let today = this.get('powerCalendarService').getDate();
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
        id: days[i].moment.format('YYYY-w'),
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

    return {
      id,
      number: momentDate.date(),
      date: momentDate._d,
      moment: momentDate,
      isDisabled: this.dayIsDisabled(momentDate),
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

  dayIsDisabled(momentDate) {
    let isDisabled = !this.get('onSelect');
    if (isDisabled) {
      return true;
    }

    let minDate = this.get('minDate');
    if (minDate && momentDate.isBefore(minDate)) {
      return true;
    }

    let maxDate = this.get('maxDate');
    if (maxDate && momentDate.isAfter(maxDate)) {
      return true;
    }

    let disabledDates = this.get('disabledDates');
    if (disabledDates && disabledDates.some((d) => momentDate.isSame(d, 'day'))) {
      return true;
    }

    return false;
  },

  firstDay(calendar) {
    let firstDay = calendar.center.clone().startOf('month');
    let localeStartOfWeek = this.get('localeStartOfWeek');
    while ((firstDay.isoWeekday() % 7) !== localeStartOfWeek) {
      firstDay.add(-1, 'day');
    }
    return firstDay;
  },

  lastDay(calendar) {
    let localeStartOfWeek = this.get('localeStartOfWeek');
    let lastDay = calendar.center.clone().endOf('month');
    let localeEndOfWeek = (localeStartOfWeek + 6) % 7;
    while ((lastDay.isoWeekday() % 7) !== localeEndOfWeek) {
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
