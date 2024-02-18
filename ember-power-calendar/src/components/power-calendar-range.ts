import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { guidFor } from '@ember/object/internals';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import PowerCalendarRangeDaysComponent from './power-calendar-range/days.ts';
import PowerCalendarNavComponent from './power-calendar/nav.ts';
import { publicActionsObject } from '../-private/utils.ts';
import {
  normalizeDate,
  normalizeRangeActionValue,
  diff,
  isAfter,
  isBefore,
  normalizeDuration,
  normalizeCalendarValue,
  type NormalizeRangeActionValue,
  type PowerCalendarDay,
  type SelectedPowerCalendarRange,
} from '../utils.ts';
import type {
  PowerCalendarAPI,
  PowerCalendarSignature,
  PowerCalendarArgs,
  TCalendarType,
  SelectedDays,
  PowerCalendarActions,
  CalendarDay,
  CalendarAPI,
} from './power-calendar.ts';
import type Owner from '@ember/owner';
import type { ComponentLike } from '@glint/template';
import type PowerCalendarService from '../services/power-calendar.ts';

export interface PowerCalendarRangeDay extends Omit<PowerCalendarDay, 'date'> {
  date: SelectedPowerCalendarRange;
}

export const DAY_IN_MS = 86400000;

export type TPowerCalendarRangeOnSelect = (
  day: NormalizeRangeActionValue,
  calendar: PowerCalendarRangeAPI,
  event: MouseEvent,
) => void;

interface PowerCalendarRangeArgs
  extends Omit<PowerCalendarArgs, 'selected' | 'onSelect'> {
  selected?: SelectedPowerCalendarRange;
  minRange?: number;
  maxRange?: number;
  proximitySelection?: boolean;
  onSelect?: TPowerCalendarRangeOnSelect;
}

export interface PowerCalendarRangeDefaultBlock extends PowerCalendarRangeAPI {
  NavComponent: ComponentLike<any>;
  DaysComponent: ComponentLike<any>;
}

interface PowerCalendarRangeSignature
  extends Omit<PowerCalendarSignature, 'Args' | 'Blocks'> {
  Args: PowerCalendarRangeArgs;
  Blocks: {
    default: [PowerCalendarRangeDefaultBlock];
  };
}

export interface PowerCalendarRangeAPI
  extends Omit<PowerCalendarAPI, 'selected'> {
  selected?: SelectedPowerCalendarRange;
  minRange?: number | null;
  maxRange?: number | null;
}

export default class PowerCalendarRangeComponent extends Component<PowerCalendarRangeSignature> {
  @service declare powerCalendar: PowerCalendarService;

  @tracked center = null;
  @tracked _calendarType: TCalendarType = 'range';
  @tracked _selected?: SelectedDays;

  navComponent: ComponentLike<any> = PowerCalendarNavComponent;
  daysComponent: ComponentLike<any> = PowerCalendarRangeDaysComponent;

  // Lifecycle hooks
  constructor(owner: Owner, args: PowerCalendarRangeArgs) {
    super(owner, args);
    this.registerCalendar();
    if (this.args.onInit) {
      this.args.onInit(this.publicAPI);
    }
  }

  get publicActions(): PowerCalendarActions {
    return publicActionsObject(
      this.args.onSelect,
      this.select,
      this.args.onCenterChange,
      this.changeCenterTask,
      this.currentCenter,
    );
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

  get currentCenter(): Date {
    let center = this.args.center;
    if (!center) {
      center = this.selected.start || this.powerCalendar.getDate();
    }
    return normalizeDate(center) || this.powerCalendar.getDate();
  }

  get publicAPI(): PowerCalendarRangeAPI {
    return {
      uniqueId: guidFor(this),
      type: this._calendarType,
      selected: this.selected,
      loading: this.changeCenterTask.isRunning,
      center: this.currentCenter,
      locale: this.args.locale || this.powerCalendar.locale,
      actions: this.publicActions,
      minRange: this.minRange,
      maxRange: this.maxRange,
    };
  }

  get tagWithDefault(): string {
    if (this.args.tag === undefined || this.args.tag === null) {
      return 'div';
    }
    return this.args.tag;
  }

  get proximitySelection(): boolean {
    return this.args.proximitySelection !== undefined
      ? this.args.proximitySelection
      : false;
  }

  get minRange(): number | null {
    if (this.args.minRange !== undefined) {
      return this._formatRange(this.args.minRange) as number;
    }

    return DAY_IN_MS;
  }

  get maxRange(): number | null {
    if (this.args.maxRange !== undefined) {
      return this._formatRange(this.args.maxRange) as number;
    }

    return null;
  }

  // Tasks
  changeCenterTask = task(
    async (newCenter: Date, calendar: PowerCalendarRangeAPI, e: MouseEvent) => {
      assert(
        "You attempted to move the center of a calendar that doesn't receive an `@onCenterChange` action.",
        typeof this.args.onCenterChange === 'function',
      );
      const value = normalizeCalendarValue({ date: newCenter });
      await this.args.onCenterChange(value, calendar, e);
    },
  );

  // Actions
  @action
  select(day: CalendarDay, calendar: CalendarAPI, e: MouseEvent) {
    const { date } = day as NormalizeRangeActionValue;
    assert(
      'date must be either a Date, or a Range',
      date &&
        (ownProp(date, 'start') ||
          ownProp(date, 'end') ||
          date instanceof Date),
    );

    let range: NormalizeRangeActionValue;

    if (ownProp(date, 'start') && ownProp(date, 'end')) {
      range = { date };
    } else {
      range = this._buildRange({ date } as { date: Date });
    }

    const { start, end } = range.date;
    if (start && end) {
      const { minRange, maxRange } = this.publicAPI;
      const diffInMs = Math.abs(diff(end, start));
      if (
        diffInMs < (minRange ?? DAY_IN_MS) ||
        (maxRange && diffInMs > maxRange)
      ) {
        return;
      }
    }

    if (this.args.onSelect) {
      this.args.onSelect(range, calendar as PowerCalendarRangeAPI, e);
    }
  }

  @action
  destroyElement() {
    this.unregisterCalendar();
  }

  _formatRange(v: number | undefined) {
    if (typeof v === 'number') {
      return v * DAY_IN_MS;
    }

    return normalizeDuration(v === undefined ? DAY_IN_MS : v);
  }

  // Methods
  _buildRange(day: { date: Date }): NormalizeRangeActionValue {
    const selected = this.selected || { start: null, end: null };
    const { start, end } = selected;

    if (this.proximitySelection) {
      return this._buildRangeByProximity(day, start, end);
    }

    return this._buildDefaultRange(day, start, end);
  }

  _buildRangeByProximity(
    day: { date: Date },
    start?: Date | null,
    end?: Date | null,
  ): NormalizeRangeActionValue {
    if (start && end) {
      const changeStart =
        Math.abs(diff(day.date, end)) > Math.abs(diff(day.date, start));

      return normalizeRangeActionValue({
        date: {
          start: changeStart ? day.date : start,
          end: changeStart ? end : day.date,
        },
      });
    }

    if (start && isBefore(day.date, start)) {
      return normalizeRangeActionValue({
        date: { start: day.date, end: null },
      });
    }

    return this._buildDefaultRange(day, start, end);
  }

  _buildDefaultRange(
    day: { date: Date },
    start?: Date | null,
    end?: Date | null,
  ): NormalizeRangeActionValue {
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

  // Methods
  registerCalendar() {
    if (window) {
      // @ts-expect-error Property '__powerCalendars'
      window.__powerCalendars = window.__powerCalendars || {}; // TODO: weakmap??
      // @ts-expect-error Property '__powerCalendars'
      window.__powerCalendars[this.publicAPI.uniqueId] = this;
    }
  }

  unregisterCalendar() {
    // @ts-expect-error Property '__powerCalendars'
    if (window && window.__powerCalendars?.[guidFor(this)]) {
      // @ts-expect-error Property '__powerCalendars'
      delete window.__powerCalendars[guidFor(this)];
    }
  }
}

function ownProp<T = { [key: string | number]: any }>(obj: T, prop: keyof T) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
