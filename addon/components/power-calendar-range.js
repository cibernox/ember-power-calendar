import { computed, getProperties } from '@ember/object';
import { assign } from '@ember/polyfills';
import moment from 'moment';
import CalendarComponent from './power-calendar';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import {
  normalizeDate,
  diff,
  isAfter,
  isBefore
} from 'ember-power-calendar/utils/date-utils';

function parseDuration(value) {
  if (value === null || moment.isDuration(value)) {
    return value;
  }
  if (typeof value === 'number') {
    return moment.duration(value, 'days');
  }
  if (typeof value === 'string') {
    let [, quantity, units] = value.match(/(\d+)(.*)/);
    units = units.trim() || 'days';
    return moment.duration(parseInt(quantity, 10), units);
  }
}

export default CalendarComponent.extend({
  daysComponent: 'power-calendar-range/days',
  minRange: fallbackIfUndefined(moment.duration(1, 'day')),
  maxRange: fallbackIfUndefined(null),
  proximitySelection: fallbackIfUndefined(false),

  // CPs
  selected: computed({
    get() {
      return { start: undefined, end: undefined };
    },
    set(_, v = {}) {
      return { start: normalizeDate(v.start), end: normalizeDate(v.end) };
    }
  }),

  currentCenter: computed('center', function() {
    let center = this.get('center');
    if (center) {
      return center;
    }
    return this.get('selected.start') || this.get('powerCalendarService').getDate();
  }),

  minRangeDuration: computed('minRange', function() {
    return parseDuration(this.get('minRange'));
  }),

  maxRangeDuration: computed('maxRange', function() {
    return parseDuration(this.get('maxRange'));
  }),

  publicAPI: computed('_publicAPI', 'minRangeDuration', 'maxRangeDuration', function() {
    let rangeOnlyAPI = { minRange: this.get('minRangeDuration'), maxRange: this.get('maxRangeDuration') };
    return assign(rangeOnlyAPI, this.get('_publicAPI'));
  }),

  // Actions
  actions: {
    select(day, calendar, e) {
      let range = this._buildRange(day);
      let { start, end } = range.date;
      if (start && end) {
        let { minRange, maxRange } = this.get('publicAPI');
        let diffInMs = Math.abs(diff(end, start));
        if (diffInMs < minRange.as('ms') || maxRange && diffInMs > maxRange.as('ms')) {
          return;
        }
      }
      let action = this.get('onSelect');
      if (action) {
        action(range, calendar, e);
      }
    }
  },

  // Methods
  _buildRange(day) {
    let selected = this.get('publicAPI.selected') || { start: null, end: null };
    let { start, end } = getProperties(selected, 'start', 'end');

    if (this.get('proximitySelection')) {
      return this._buildRangeByProximity(day, start, end);
    }

    return this._buildDefaultRange(day, start, end);
  },

  _buildRangeByProximity(day, start, end) {
    if (start && end) {
      let changeStart = Math.abs(diff(day.date, end)) > Math.abs(diff(day.date, start));

      return {
        // moment: { start: changeStart ? day.moment : startMoment, end: changeStart ? endMoment : day.moment },
        date: { start: changeStart ? day.date : start, end: changeStart ? end : day.date }
      };
    }

    if (isBefore(day.date, start)) {
      return {
        // moment: { start: day.moment, end: null },
        date: { start: day.date, end: null }
      };
    }

    return this._buildDefaultRange(day, start, end);
  },

  _buildDefaultRange(day, start, end) {
    if (start && !end) {
      // let startMoment = moment(start);
      if (isAfter(start, day.date)) {
        return {
          // moment: { start: day.moment, end: startMoment },
          date: { start: day.date, end: start }
        };
      }

      return {
        // moment: { start: startMoment, end: day.moment },
        date: { start: start, end: day.date }
      };
    }

    return {
      // moment: { start: day.moment, end: null },
      date: { start: day.date, end: null }
    };
  }
});
