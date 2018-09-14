import { computed, getProperties } from '@ember/object';
import { assign } from '@ember/polyfills';
import CalendarComponent from './power-calendar';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import {
  normalizeDate,
  normalizeRangeActionValue,
  diff,
  isAfter,
  isBefore,
  normalizeDuration
} from 'ember-power-calendar-utils';

export default CalendarComponent.extend({
  daysComponent: 'power-calendar-range/days',
  _calendarType: 'range',
  proximitySelection: fallbackIfUndefined(false),

  // CPs
  minRange: computed({
    get() {
      return 86400000;
    },
    set(_, v) {
      if (typeof v === 'number') {
        return v * 86400000;
      }
      return normalizeDuration(v === undefined ? 86400000 : v);
    }
  }),
  maxRange: computed({
    get() {
      return null;
    },
    set(_, v) {
      if (typeof v === 'number') {
        return v * 86400000;
      }
      return normalizeDuration(v === undefined ? 86400000 : v);
    }
  }),
  selected: computed({
    get() {
      return { start: undefined, end: undefined };
    },
    set(_, v) {
      if (v === undefined || v === null) {
        v = {};
      }
      return { start: normalizeDate(v.start), end: normalizeDate(v.end) };
    }
  }),

  currentCenter: computed('center', function() {
    let center = this.get('center');
    if (!center) {
      center = this.get('selected.start') || this.get('powerCalendarService').getDate();
    }
    return normalizeDate(center);
  }),

  publicAPI: computed('_publicAPI', 'minRange', 'maxRange', function() {
    let rangeOnlyAPI = this.getProperties('minRange', 'maxRange');
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
        if (diffInMs < minRange || maxRange && diffInMs > maxRange) {
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

      return normalizeRangeActionValue({
        date: {
          start: changeStart ? day.date : start,
          end: changeStart ? end : day.date
        }
      });
    }

    if (isBefore(day.date, start)) {
      return normalizeRangeActionValue({ date: { start: day.date, end: null } });
    }

    return this._buildDefaultRange(day, start, end);
  },

  _buildDefaultRange(day, start, end) {
    if (start && !end) {
      if (isAfter(start, day.date)) {
        return normalizeRangeActionValue({ date: { start: day.date, end: start } });
      }
      return normalizeRangeActionValue({ date: { start: start, end: day.date } });
    }

    return normalizeRangeActionValue({ date: { start: day.date, end: null } });
  }
});
