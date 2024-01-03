import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import CalendarComponent from './power-calendar';
import {
  normalizeDate,
  normalizeRangeActionValue,
  diff,
  isAfter,
  isBefore,
  normalizeDuration,
} from '../utils';
import { assert } from '@ember/debug';

import ownProp from '../-private/utils/own-prop';
import PowerCalendarRangeComponent from './power-calendar-range/days';

export default class extends CalendarComponent {
  @tracked _selected;

  daysComponent = PowerCalendarRangeComponent;
  _calendarType = 'range';

  get proximitySelection() {
    return this.args.proximitySelection !== undefined
      ? this.args.proximitySelection
      : false;
  }

  get minRange() {
    if (this.args.minRange !== undefined) {
      return this._formatRange(this.args.minRange);
    }

    return 86400000;
  }

  get maxRange() {
    if (this.args.maxRange !== undefined) {
      return this._formatRange(this.args.maxRange);
    }

    return null;
  }

  get selected() {
    if (this._selected) {
      return this._selected;
    }

    if (this.args.selected) {
      return {
        start: normalizeDate(this.args.selected.start),
        end: normalizeDate(this.args.selected.end),
      };
    }

    return { start: undefined, end: undefined };
  }

  set selected(v) {
    if (v === undefined || v === null) {
      v = {};
    }
    this._selected = {
      start: normalizeDate(v.start),
      end: normalizeDate(v.end),
    };
  }

  get currentCenter() {
    let center = this.args.center;
    if (!center) {
      center = this.selected.start || this.powerCalendarService.getDate();
    }
    return normalizeDate(center);
  }

  get publicAPI() {
    let rangeOnlyAPI = {
      minRange: this.minRange,
      maxRange: this.maxRange,
    };
    return Object.assign(rangeOnlyAPI, this._publicAPI);
  }

  // Actions
  @action
  select({ date }, calendar, e) {
    assert(
      'date must be either a Date, or a Range',
      date &&
        (ownProp(date, 'start') ||
          ownProp(date, 'end') ||
          date instanceof Date),
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
      if (diffInMs < minRange || (maxRange && diffInMs > maxRange)) {
        return;
      }
    }

    if (this.args.onSelect) {
      this.args.onSelect(range, calendar, e);
    }
  }

  _formatRange(v) {
    if (typeof v === 'number') {
      return v * 86400000;
    }

    return normalizeDuration(v === undefined ? 86400000 : v);
  }

  // Methods
  _buildRange(day) {
    let selected = this.publicAPI.selected || { start: null, end: null };
    let { start, end } = selected;

    if (this.proximitySelection) {
      return this._buildRangeByProximity(day, start, end);
    }

    return this._buildDefaultRange(day, start, end);
  }

  _buildRangeByProximity(day, start, end) {
    if (start && end) {
      let changeStart =
        Math.abs(diff(day.date, end)) > Math.abs(diff(day.date, start));

      return normalizeRangeActionValue({
        date: {
          start: changeStart ? day.date : start,
          end: changeStart ? end : day.date,
        },
      });
    }

    if (isBefore(day.date, start)) {
      return normalizeRangeActionValue({
        date: { start: day.date, end: null },
      });
    }

    return this._buildDefaultRange(day, start, end);
  }

  _buildDefaultRange(day, start, end) {
    if (start && !end) {
      if (isAfter(start, day.date)) {
        return normalizeRangeActionValue({
          date: { start: day.date, end: start },
        });
      }
      return normalizeRangeActionValue({
        date: { start: start, end: day.date },
      });
    }

    return normalizeRangeActionValue({ date: { start: day.date, end: null } });
  }
}
