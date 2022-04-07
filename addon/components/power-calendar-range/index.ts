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
  PowerCalendarArgs,
  PowerCalendarDay,
  TCalendarType
} from '../power-calendar';

export interface SelectedPowerCalendarRange {
  start?: Date;
  end?: Date;
}

export interface PowerCalendarRangeDay extends Omit<PowerCalendarDay, 'date'> {
  date: SelectedPowerCalendarRange;
}
export interface PowerCalendarRangeAPI extends Omit<PowerCalendarAPI, 'selected'> {
  selected?: SelectedPowerCalendarRange;
  minRange?: number;
  maxRange?: number;
}

interface PowerCalendarRangeArgs extends Omit<PowerCalendarArgs, 'selected' | 'onSelect'> {
  selected?: SelectedPowerCalendarRange;
  minRange?: number;
  maxRange?: number;
  onSelect?: (
    day: { date: SelectedPowerCalendarRange },
    calendar: PowerCalendarRangeAPI,
    event: MouseEvent
  ) => void;
}

export const DAY_IN_MS = 86400000;

export default class PowerCalendarRange extends PowerCalendarComponent<PowerCalendarRangeArgs> {
  daysComponent = 'power-calendar-range/days';
  _calendarType: TCalendarType = 'range';

  // CP
  get minRange(): number | null {
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
  select(day: PowerCalendarRangeDay, calendar: PowerCalendarRangeAPI, e: MouseEvent) {
    const { date } = day;
    assert(
      'date must be either a Date, or a Range',
      date &&
        (ownProp(date as SelectedPowerCalendarRange, 'start') ||
          ownProp(date as SelectedPowerCalendarRange, 'end') ||
          date instanceof Date)
    );

    let range: { date: SelectedPowerCalendarRange };

    if (
      ownProp(date as SelectedPowerCalendarRange, 'start') &&
      ownProp(date as SelectedPowerCalendarRange, 'end')
    ) {
      range = { date };
    } else {
      range = this._buildRange({ date } as { date: Date });
    }

    const { start, end } = range.date;
    if (start && end) {
      const { minRange, maxRange } = this.publicAPI;
      const diffInMs = Math.abs(diff(end, start));
      if (diffInMs < (minRange ?? DAY_IN_MS) || (maxRange && diffInMs > maxRange)) {
        return;
      }
    }

    if (this.args.onSelect) {
      this.args.onSelect(range, calendar, e);
    }
  }

  _buildRange(day: { date: Date }) {
    const start = this.selected.start;
    const end = this.selected.end;

    if (this.proximitySelection) {
      return this._buildRangeByProximity(day, start, end);
    }

    return this._buildDefaultRange(day, start, end);
  }

  _buildRangeByProximity(day: { date: Date }, start?: Date, end?: Date) {
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

  _buildDefaultRange(day: { date: Date }, start?: Date, end?: Date) {
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
