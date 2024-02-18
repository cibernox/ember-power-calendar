import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { assert } from '@ember/debug';
import type { ComponentLike } from '@glint/template';
import {
  normalizeDate,
  normalizeCalendarValue,
  type NormalizeCalendarValue,
  type PowerCalendarDay,
  type SelectedPowerCalendarRange,
} from '../utils.ts';
import PowerCalendarNavComponent from './power-calendar/nav.ts';
import PowerCalendarDaysComponent from './power-calendar/days.ts';
import type Owner from '@ember/owner';
import type PowerCalendarService from '../services/power-calendar.ts';
import type {
  PowerCalendarRangeAPI,
  PowerCalendarRangeDay,
} from './power-calendar-range.ts';
import type { PowerCalendarMultipleAPI } from './power-calendar-multiple.ts';
import { publicActionsObject } from '../-private/utils.ts';

export type TCalendarType = 'multiple' | 'range' | 'single';
export type TPowerCalendarMoveCenterUnit = 'year' | 'month';
export type SelectedDays =
  | SelectedPowerCalendarRange
  | Date
  | Date[]
  | undefined;
export type CalendarAPI =
  | PowerCalendarAPI
  | PowerCalendarMultipleAPI
  | PowerCalendarRangeAPI;

export interface PowerCalendarAPI {
  uniqueId: string;
  calendarUniqueId?: string;
  selected?: SelectedDays;
  loading: boolean;
  center: Date;
  locale: string;
  type: TCalendarType;
  actions: PowerCalendarActions;
}

export interface PowerCalendarActions {
  changeCenter?: (
    newCenter: Date,
    calendar: CalendarAPI,
    event: MouseEvent,
  ) => void;
  moveCenter?: (
    step: number,
    unit: TPowerCalendarMoveCenterUnit,
    calendar: PowerCalendarAPI,
    event: MouseEvent,
  ) => void;
  select?: (day: CalendarDay, calendar: CalendarAPI, event: MouseEvent) => void;
}

export type TPowerCalendarOnSelect = (
  day: CalendarDay,
  calendar: CalendarAPI,
  event: MouseEvent,
) => void;

export interface PowerCalendarArgs {
  daysComponent?: string | ComponentLike<any>;
  locale: string;
  navComponent?: string | ComponentLike<any>;
  onCenterChange?: (
    newCenter: NormalizeCalendarValue,
    calendar: PowerCalendarAPI,
    event: MouseEvent,
  ) => void;
  onInit?: (calendar: PowerCalendarAPI) => void;
  onSelect?: TPowerCalendarOnSelect;
  selected?: SelectedDays;
  center?: Date;
  tag?: string;
}

export interface PowerCalendarDefaultBlock extends PowerCalendarAPI {
  NavComponent: ComponentLike<any>;
  DaysComponent: ComponentLike<any>;
}

export type CalendarDay =
  | PowerCalendarDay
  | PowerCalendarRangeDay
  | PowerCalendarDay[];

export interface PowerCalendarSignature {
  Element: HTMLElement;
  Args: PowerCalendarArgs;
  Blocks: {
    default: [PowerCalendarDefaultBlock];
  };
}

export default class PowerCalendarComponent extends Component<PowerCalendarSignature> {
  @service declare powerCalendar: PowerCalendarService;

  @tracked center = null;
  @tracked _calendarType: TCalendarType = 'single';
  @tracked _selected?: SelectedDays;

  navComponent: ComponentLike<any> = PowerCalendarNavComponent;
  daysComponent: ComponentLike<any> = PowerCalendarDaysComponent;

  // Lifecycle hooks
  constructor(owner: Owner, args: PowerCalendarArgs) {
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

  get selected(): SelectedDays {
    if (this._selected) {
      return this._selected;
    }

    return normalizeDate(this.args.selected as Date);
  }

  set selected(v: SelectedDays) {
    this._selected = normalizeDate(v as Date | undefined);
  }

  get currentCenter(): Date {
    let center = this.args.center;
    if (!center) {
      center = (this.selected as Date) || this.powerCalendar.getDate();
    }
    return normalizeDate(center) || this.powerCalendar.getDate();
  }

  get publicAPI(): PowerCalendarAPI {
    return this._publicAPI;
  }

  get _publicAPI(): PowerCalendarAPI {
    return {
      uniqueId: guidFor(this),
      type: this._calendarType,
      selected: this.selected,
      loading: this.changeCenterTask.isRunning,
      center: this.currentCenter,
      locale: this.args.locale || this.powerCalendar.locale,
      actions: this.publicActions,
    };
  }

  get tagWithDefault(): string {
    if (this.args.tag === undefined || this.args.tag === null) {
      return 'div';
    }
    return this.args.tag;
  }

  // Tasks
  changeCenterTask = task(
    async (newCenter: Date, calendar: PowerCalendarAPI, e: MouseEvent) => {
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
  select(day: CalendarDay, calendar: PowerCalendarAPI, e: MouseEvent) {
    if (this.args.onSelect) {
      this.args.onSelect(day, calendar, e);
    }
  }

  @action
  destroyElement() {
    this.unregisterCalendar();
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
