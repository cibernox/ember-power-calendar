import { computed, action, getProperties } from '@ember/object';
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
import { assert } from '@ember/debug';

import ownProp from 'ember-power-calendar/-private/utils/own-prop';

export default class extends CalendarComponent {
  @fallbackIfUndefined(false) proximitySelection
  daysComponent = 'power-calendar-range/days'
  _calendarType = 'range'

  // CPs
  @computed
  get minRange() {
    return 86400000;
  }
  set minRange(v) {
    if (typeof v === 'number') {
      return v * 86400000;
    }
    return normalizeDuration(v === undefined ? 86400000 : v);
  }

  @computed
  get maxRange() {
    return null;
  }
  set maxRange(v) {
    if (typeof v === 'number') {
      return v * 86400000;
    }
    return normalizeDuration(v === undefined ? 86400000 : v);
  }

  @computed
  get selected() {
    return { start: undefined, end: undefined };
  }
  set selected(v) {
    if (v === undefined || v === null) {
      v = {};
    }
    return { start: normalizeDate(v.start), end: normalizeDate(v.end) };
  }

  @computed('center')
  get currentCenter() {
    let center = this.center;
    if (!center) {
      center = this.selected.start || this.powerCalendarService.getDate();
    }
    return normalizeDate(center);
  }

  @computed('_publicAPI', 'minRange', 'maxRange')
  get publicAPI() {
    let rangeOnlyAPI = this.getProperties('minRange', 'maxRange');
    return Object.assign(rangeOnlyAPI, this._publicAPI);
  }

  // Actions
  @action
  select({ date }, calendar, e) {
    assert(
      'date must be either a Date, or a Range',
      date && (ownProp(date, 'start') || ownProp(date, 'end') || date instanceof Date)
    );

    let range;

    if (ownProp(date, 'start') && ownProp(date, 'end')) {
      range = { date };
    } else {
      range = this._buildRange({ date });
    }

    let { start, end } = range.date;
    if (start && end) {
      let { minRange, maxRange } = this.publicAPI;
      let diffInMs = Math.abs(diff(end, start));
      if (diffInMs < minRange || maxRange && diffInMs > maxRange) {
        return;
      }
    }

    if (this.onSelect) {
      this.onSelect(range, calendar, e);
    }
  }

  // Methods
  _buildRange(day) {
    let selected = this.publicAPI.selected || { start: null, end: null };
    let { start, end } = getProperties(selected, 'start', 'end');

    if (this.proximitySelection) {
      return this._buildRangeByProximity(day, start, end);
    }

    return this._buildDefaultRange(day, start, end);
  }

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
  }

  _buildDefaultRange(day, start, end) {
    if (start && !end) {
      if (isAfter(start, day.date)) {
        return normalizeRangeActionValue({ date: { start: day.date, end: start } });
      }
      return normalizeRangeActionValue({ date: { start: start, end: day.date } });
    }

    return normalizeRangeActionValue({ date: { start: day.date, end: null } });
  }
}
