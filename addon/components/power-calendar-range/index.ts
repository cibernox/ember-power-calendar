import {
  diff,
  isAfter,
  isBefore,
  normalizeDate,
  normalizeDuration,
  normalizeRangeActionValue
} from 'ember-power-calendar-utils';
import ownProp from 'ember-power-calendar/-private/utils/own-prop';

import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { isNone } from '@ember/utils';

import PowerCalendarComponent, {
  PowerCalendarAPI,
  PowerCalendarDay,
  TCalendarType
} from '../power-calendar';

export interface SelectedPowerCalendarRange {
  start?: Date;
  end?: Date;
}

export interface PowerCalendarRangeAPI extends PowerCalendarAPI<SelectedPowerCalendarRange> {
  minRange?: number;
  maxRange?: number;
}

interface IArgs {
  selected?: SelectedPowerCalendarRange;
  minRange?: number;
  maxRange?: number;
  onSelect?: (
    day: SelectedPowerCalendarRange,
    calendar: PowerCalendarRangeAPI,
    event: MouseEvent
  ) => void;
}

export const DAY_IN_MS = 86400000;

export default class PowerCalendarRange extends PowerCalendarComponent<IArgs> {
  daysComponent = 'power-calendar-range/days';
  _calendarType: TCalendarType = 'range';

  // CP
  get minRange(): number {
    const { minRange } = this.args;

    if (typeof minRange === 'number') {
      return minRange * DAY_IN_MS;
    }
    return normalizeDuration(minRange === undefined ? DAY_IN_MS : minRange);
  }

  get maxRange(): null | number {
    const { maxRange } = this.args;

    if (typeof maxRange === 'number') {
      return maxRange * DAY_IN_MS;
    }
    return normalizeDuration(isNone(maxRange) ? null : maxRange);
  }

  get selected(): SelectedPowerCalendarRange {
    const selected = this.args.selected;

    if (!selected) {
      return { start: undefined, end: undefined };
    }

    return {
      start: normalizeDate(selected.start),
      end: normalizeDate(selected.end)
    };
  }

  get currentCenter() {
    let center = this.args.center;
    if (!center) {
      center = this.selected.start || this.powerCalendar.getDate();
    }
    return normalizeDate(center);
  }

  get publicAPI() {
    const { minRange, maxRange } = this;
    let rangeOnlyAPI = { minRange, maxRange };
    return Object.assign(rangeOnlyAPI, this._publicAPI);
  }

  // Actions
  @action
  select<T = { date: SelectedPowerCalendarRange }>(
    { date }: T,
    calendar: PowerCalendarRangeAPI,
    e: MouseEvent
  ) {
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

    const { start, end } = range.date;
    if (start && end) {
      const { minRange, maxRange } = this.publicAPI;
      const diffInMs = Math.abs(diff(end, start));
      if (diffInMs < minRange || (maxRange && diffInMs > maxRange)) {
        return;
      }
    }

    if (this.args.onSelect) {
      this.args.onSelect(range, calendar, e);
    }
  }

  _buildRange(day: Partial<PowerCalendarDay>) {
    const start = this.selected.start;
    const end = this.selected.end;

    if (this.proximitySelection) {
      return this._buildRangeByProximity(day, start, end);
    }

    return this._buildDefaultRange(day, start, end);
  }

  _buildRangeByProximity(day: Partial<PowerCalendarDay>, start?: Date, end?: Date) {
    if (start && end) {
      const changeStart = Math.abs(diff(day.date, end)) > Math.abs(diff(day.date, start));

      return normalizeRangeActionValue({
        date: {
          start: changeStart ? day.date : start,
          end: changeStart ? end : day.date
        }
      });
    }

    if (isBefore(day.date, start)) {
      return normalizeRangeActionValue({
        date: { start: day.date, end: null }
      });
    }

    return this._buildDefaultRange(day, start, end);
  }

  _buildDefaultRange(day: Partial<PowerCalendarDay>, start?: Date, end?: Date) {
    if (start && !end) {
      if (isAfter(start, day.date)) {
        return normalizeRangeActionValue({
          date: { start: day.date, end: start }
        });
      }
      return normalizeRangeActionValue({
        date: { start: start, end: day.date }
      });
    }

    return normalizeRangeActionValue({ date: { start: day.date, end: null } });
  }
}
