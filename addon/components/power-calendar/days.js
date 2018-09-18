import Component from '@ember/component';
import { computed } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject } from '@ember/service';
import { assert } from '@ember/debug';
import layout from '../../templates/components/power-calendar/days';
import {
  add,
  startOf,
  endOf,
  getWeekdays,
  getWeekdaysMin,
  getWeekdaysShort,
  formatDate,
  isoWeekday,
  isBefore,
  isAfter,
  isSame,
  withLocale,
  normalizeCalendarDay
} from 'ember-power-calendar-utils';

const WEEK_DAYS = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun'
];

export default Component.extend({
  layout,
  focusedId: null,
  showDaysAround: true,
  classNames: ['ember-power-calendar-days'],
  weekdayFormat: 'short', // "min" | "short" | "long"
  powerCalendarService: inject('power-calendar'),
  attributeBindings: [
    'data-power-calendar-id'
  ],

  // CPs
  'data-power-calendar-id': computed.oneWay('calendar.uniqueId'),
  weekdaysMin: computed('calendar.locale', function() {
    return withLocale(this.get("calendar.locale"), getWeekdaysMin);
  }),

  weekdaysShort: computed('calendar.locale', function() {
    return withLocale(this.get("calendar.locale"), getWeekdaysShort);
  }),

  weekdays: computed('calendar.locale', function() {
    return withLocale(this.get("calendar.locale"), getWeekdays);
  }),

  localeStartOfWeek: computed('weekdaysShort', 'startOfWeek', function() {
    let forcedStartOfWeek = this.get('startOfWeek');
    if (forcedStartOfWeek) {
      return parseInt(forcedStartOfWeek, 10);
    }
    let now = this.get('powerCalendarService').getDate();
    let day = withLocale(this.get('calendar.locale'), () => formatDate(startOf(now, 'week'), 'dddd'));
    let idx = this.get('weekdays').indexOf(day);
    return idx >= 0 ? idx : 0;
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
    let day = this.firstDay(calendar);
    let days = [];
    while (isBefore(day, lastDay)) {
      days.push(this.buildDay(day, today, calendar));
      day = add(day, 1, "day");
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
        id: `week-of-${daysOfWeek[0].id}`,
        days: daysOfWeek,
        missingDays: 7 - daysOfWeek.length
      });
      i += 7;
    }
    return weeks;
  }),

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this._handleDayClick = this._handleDayClick.bind(this);
  },

  didInsertElement() {
    this._super(...arguments);
    this.element.addEventListener('click', this._handleDayClick);
  },

  willRemoveElement() {
    this._super(...arguments);
    this.element.removeEventListener('click', this._handleDayClick);
  },

  // Actions
  actions: {
    onFocusDay(day) {
      scheduleOnce('actions', this, this._updateFocused, day.id);
    },

    onBlurDay() {
      scheduleOnce('actions', this, this._updateFocused, null);
    },

    onKeyDown(calendar, e) {
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
  buildDay(date, today, calendar) {
    let id = formatDate(date, 'YYYY-MM-DD')

    return normalizeCalendarDay({
      id,
      number: date.getDate(),
      date: new Date(date),
      isDisabled: this.dayIsDisabled(date),
      isFocused: this.get('focusedId') === id,
      isCurrentMonth: date.getMonth() === calendar.center.getMonth(),
      isToday: isSame(date, today, 'day'),
      isSelected: this.dayIsSelected(date, calendar)
    });
  },

  buildonSelectValue(day) {
    return day;
  },

  dayIsSelected(date, calendar = this.get('calendar')) {
    return calendar.selected ? isSame(date, calendar.selected, 'day') : false;
  },

  dayIsDisabled(date) {
    let isDisabled = !this.get('calendar.actions.select');
    if (isDisabled) {
      return true;
    }

    let minDate = this.get('minDate');
    if (minDate && isBefore(date, minDate)) {
      return true;
    }

    let maxDate = this.get('maxDate');
    if (maxDate && isAfter(date, maxDate)) {
      return true;
    }

    let disabledDates = this.get('disabledDates');

    if (disabledDates) {
      let disabledInRange = disabledDates.some((d) => {
        let isSameDay = isSame(date, d, 'day');
        let isWeekDayIncludes = WEEK_DAYS.indexOf(d) !== -1 && formatDate(date, 'ddd') === d;
        return isSameDay || isWeekDayIncludes;
      });

      if (disabledInRange) {
        return true;
      }
    }

    return false;
  },

  firstDay(calendar) {
    let firstDay = startOf(calendar.center, 'month');
    let localeStartOfWeek = this.get('localeStartOfWeek');
    while ((isoWeekday(firstDay) % 7) !== localeStartOfWeek) {
      firstDay = add(firstDay, -1, "day");
    }
    return firstDay;
  },

  lastDay(calendar) {
    let localeStartOfWeek = this.get('localeStartOfWeek');
    assert("The center of the calendar is an invalid date.", !isNaN(calendar.center.getTime()));
    let lastDay = endOf(calendar.center, 'month')
    let localeEndOfWeek = (localeStartOfWeek + 6) % 7;
    while (isoWeekday(lastDay) % 7 !== localeEndOfWeek) {
      lastDay = add(lastDay, 1, 'day');
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
  },

  _handleDayClick(e) {
    let dayEl = e.target.closest('[data-date]');
    if (dayEl) {
      let dateStr = dayEl.dataset.date;
      let day = this.get('days').find(d => d.id === dateStr);
      if (day) {
        let calendar = this.get('calendar');
        if (calendar.actions.select) {
          calendar.actions.select(day, calendar, e);
        }
      }
    }
  }
});
