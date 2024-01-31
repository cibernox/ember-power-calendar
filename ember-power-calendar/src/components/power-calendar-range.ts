import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {
  normalizeDate,
  normalizeRangeActionValue,
  diff,
  isAfter,
  isBefore,
  normalizeDuration,
} from '../utils.ts';
import { assert } from '@ember/debug';
import PowerCalendarRangeComponent from './power-calendar-range/days.ts';
import PowerCalendarComponent, {
  type PowerCalendarAPI,
  type PowerCalendarSignature,
  type PowerCalendarArgs,
  type PowerCalendarDay,
  type TCalendarType
} from './power-calendar.ts';

export interface SelectedPowerCalendarRange {
  start?: Date;
  end?: Date;
}

export interface PowerCalendarRangeDay extends Omit<PowerCalendarDay, 'date'> {
  date: SelectedPowerCalendarRange;
}

export const DAY_IN_MS = 86400000;

interface PowerCalendarRangeArgs extends Omit<PowerCalendarArgs, 'selected' | 'onSelect'> {
  selected?: SelectedPowerCalendarRange;
  minRange?: number;
  maxRange?: number;
  proximitySelection?: boolean;
  onSelect?: (
    day: { date: SelectedPowerCalendarRange },
    calendar: PowerCalendarRangeAPI,
    event: MouseEvent
  ) => void;
}

interface PowerCalendarRangeSignature extends Omit<PowerCalendarSignature, 'Args'> {
  Args: PowerCalendarRangeArgs;
}

export interface PowerCalendarRangeAPI extends Omit<PowerCalendarAPI, 'selected'> {
  selected?: SelectedPowerCalendarRange;
  minRange?: number;
  maxRange?: number;
}

export default class PowerCalendarRange extends PowerCalendarComponent<PowerCalendarRangeSignature> {
  daysComponent = PowerCalendarRangeComponent;
  @tracked _calendarType: TCalendarType = 'range';

  get proximitySelection(): boolean {
    return this.args.proximitySelection !== undefined
      ? this.args.proximitySelection
      : false;
  }

  get minRange(): number | null {
    if (this.args.minRange !== undefined) {
      return this._formatRange(this.args.minRange);
    }

    return DAY_IN_MS;
  }

  get maxRange(): number | null {
    if (this.args.maxRange !== undefined) {
      return this._formatRange(this.args.maxRange);
    }

    return null;
  }

  get selected(): SelectedPowerCalendarRange {
    if (this._selected) {
      return this._selected as SelectedPowerCalendarRange;
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
      center = this.selected.start || this.powerCalendar.getDate();
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
  select(day: PowerCalendarRangeDay, calendar: PowerCalendarRangeAPI, e: MouseEvent) {
    const { date } = day;
    assert(
      'date must be either a Date, or a Range',
      date &&
        (ownProp(date as SelectedPowerCalendarRange, 'start') ||
          ownProp(date as SelectedPowerCalendarRange, 'end') ||
          date instanceof Date),
    );

    let range: { date: SelectedPowerCalendarRange };

    if (ownProp(date as SelectedPowerCalendarRange, 'start') && ownProp(date as SelectedPowerCalendarRange, 'end')) {
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

  _formatRange(v: number | undefined) {
    if (typeof v === 'number') {
      return v * DAY_IN_MS;
    }

    return normalizeDuration(v === undefined ? DAY_IN_MS : v);
  }

  // Methods
  _buildRange(day: { date: Date }) {
    let selected = this.selected || { start: null, end: null };
    let { start, end } = selected;

    if (this.proximitySelection) {
      return this._buildRangeByProximity(day, start, end);
    }

    return this._buildDefaultRange(day, start, end);
  }

  _buildRangeByProximity(day: { date: Date }, start?: Date, end?: Date) {
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

  _buildDefaultRange(day: { date: Date }, start?: Date, end?: Date) {
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

function ownProp<T = { [key: string | number]: any }>(obj: T, prop: keyof T) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
