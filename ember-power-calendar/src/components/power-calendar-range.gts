import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import service from '../-private/service.ts';
import { guidFor } from '@ember/object/internals';
import { assert } from '@ember/debug';
import { task } from 'ember-concurrency';
import PowerCalendarRangeDaysComponent, {
  type PowerCalendarRangeDaysSignature,
} from './power-calendar-range/days.gts';
import PowerCalendarRangeNavComponent, {
  type PowerCalendarRangeNavSignature,
} from './power-calendar-range/nav.gts';
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
  PowerCalendarArgs,
  TCalendarType,
  SelectedDays,
  PowerCalendarActions,
  CalendarDay,
  CalendarAPI,
} from './power-calendar.ts';
import { DAY_IN_MS as UTILS_DAY_IN_MS } from '../-private/days-utils.ts';
import { element } from 'ember-element-helper';
import { hash } from '@ember/helper';
import type Owner from '@ember/owner';
import type { ComponentLike } from '@glint/template';
import type PowerCalendarService from '../services/power-calendar.ts';

export interface PowerCalendarRangeDay extends Omit<PowerCalendarDay, 'date'> {
  date: SelectedPowerCalendarRange;
}

export const DAY_IN_MS = UTILS_DAY_IN_MS;

export type TPowerCalendarRangeOnSelect = (
  day: NormalizeRangeActionValue,
  calendar: PowerCalendarRangeAPI,
  event: MouseEvent,
) => void;

interface PowerCalendarRangeArgs
  extends Omit<
    PowerCalendarArgs,
    'daysComponent' | 'navComponent' | 'selected' | 'onSelect'
  > {
  navComponent?: ComponentLike<PowerCalendarRangeNavSignature>;
  daysComponent?: ComponentLike<PowerCalendarRangeDaysSignature>;
  selected?: SelectedPowerCalendarRange;
  minRange?: number;
  maxRange?: number;
  proximitySelection?: boolean;
  onSelect?: TPowerCalendarRangeOnSelect;
}

export interface PowerCalendarRangeDefaultBlock extends PowerCalendarRangeAPI {
  Nav: ComponentLike<{
    Args: Omit<PowerCalendarRangeNavSignature['Args'], 'calendar'>;
    Blocks: PowerCalendarRangeNavSignature['Blocks'];
  }>;
  Days: ComponentLike<{
    Element: PowerCalendarRangeDaysSignature['Element'];
    Args: Omit<PowerCalendarRangeDaysSignature['Args'], 'calendar'>;
    Blocks: PowerCalendarRangeDaysSignature['Blocks'];
  }>;
}

interface PowerCalendarRangeSignature {
  Element: HTMLElement;
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

  // Lifecycle hooks
  constructor(owner: Owner, args: PowerCalendarRangeArgs) {
    super(owner, args);
    this.registerCalendar();
    if (this.args.onInit) {
      this.args.onInit(this.publicAPI);
    }
  }

  willDestroy(): void {
    super.willDestroy();
    this.unregisterCalendar();
  }

  get publicActions(): PowerCalendarActions {
    return publicActionsObject(
      this.args.onSelect,
      this.select.bind(this),
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

  get tagWithDefault(): keyof HTMLElementTagNameMap {
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

  get navComponent(): ComponentLike<PowerCalendarRangeNavSignature> {
    return (
      this.args.navComponent ||
      (PowerCalendarRangeNavComponent as ComponentLike<PowerCalendarRangeNavSignature>)
    );
  }

  get daysComponent(): ComponentLike<PowerCalendarRangeDaysSignature> {
    return (
      this.args.daysComponent ||
      (PowerCalendarRangeDaysComponent as ComponentLike<PowerCalendarRangeDaysSignature>)
    );
  }

  calendarAPI(
    publicAPI: PowerCalendarRangeAPI,
    components: {
      Nav: ComponentLike<PowerCalendarRangeNavSignature>;
      Days: ComponentLike<PowerCalendarRangeDaysSignature>;
    },
  ): PowerCalendarRangeDefaultBlock {
    return Object.assign(
      {},
      publicAPI,
      components,
    ) as PowerCalendarRangeDefaultBlock;
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      window.__powerCalendars = window.__powerCalendars || {}; // TODO: weakmap??
      // @ts-expect-error Property '__powerCalendars'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      window.__powerCalendars[this.publicAPI.uniqueId] = this;
    }
  }

  unregisterCalendar() {
    // @ts-expect-error Property '__powerCalendars'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (window && window.__powerCalendars?.[guidFor(this)]) {
      // @ts-expect-error Property '__powerCalendars'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      delete window.__powerCalendars[guidFor(this)];

      // @ts-expect-error Property '__powerCalendars'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (Object.keys(window.__powerCalendars).length === 0) {
        // @ts-expect-error Property '__powerCalendars'
        delete window.__powerCalendars;
      }
    }
  }

  <template>
    {{#let
      (this.calendarAPI
        this.publicAPI
        (hash
          Nav=(component
            this.navComponent calendar=this.publicAPI isDatePicker=@isDatePicker
          )
          Days=(component
            this.daysComponent
            calendar=this.publicAPI
            isDatePicker=@isDatePicker
            autofocus=@autofocus
          )
        )
      )
      as |calendar|
    }}
      {{#let (element this.tagWithDefault) as |Tag|}}
        <Tag
          class="ember-power-calendar"
          role={{if @isDatePicker "dialog" "group"}}
          aria-modal={{if @isDatePicker "true"}}
          aria-label={{if
            @ariaLabel
            @ariaLabel
            (unless @ariaLabeledBy "Choose Date Range")
          }}
          aria-labelledby={{@ariaLabeledBy}}
          ...attributes
          id={{calendar.uniqueId}}
        >
          {{#if (has-block)}}
            {{yield calendar}}
          {{else}}
            <calendar.Nav />
            <calendar.Days />
          {{/if}}
        </Tag>
      {{/let}}
    {{/let}}
  </template>
}

function ownProp<T = { [key: string | number]: never }>(obj: T, prop: keyof T) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
