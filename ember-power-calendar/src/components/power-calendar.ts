import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { assert } from '@ember/debug';
import type { ComponentLike } from '@glint/template';
import { normalizeDate, normalizeCalendarValue } from '../utils.ts';
import PowerCalendarNavComponent from './power-calendar/nav.ts';
import PowerCalendarDaysComponent from './power-calendar/days.ts';
import type PowerCalendarService from '../services/power-calendar.ts';
import type { Moment } from 'moment';
import type {
  PowerCalendarRangeAPI,
  PowerCalendarRangeDay,
  SelectedPowerCalendarRange,
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
    newCenter: any,
    calendar: PowerCalendarAPI,
    event: MouseEvent,
  ) => void;
  onInit?: (calendar: PowerCalendarAPI) => void;
  onSelect?: TPowerCalendarOnSelect;
  selected?: SelectedDays;
  center?: Date;
  tag?: string;
}

export type CalendarDay =
  | PowerCalendarDay
  | PowerCalendarRangeDay
  | PowerCalendarDay[];

export interface PowerCalendarDay {
  id: string; // A unique identified of the day. It has the format YYYY-MM-DD
  number: number; // The day's number. From 1 to 31
  date: Date; //	The native Date object representing that day.
  moment: Moment; //	The moment representing that day. (only when ember-power-calendar-moment is installed)
  isFocused: boolean; //	It is true when the the cell of that day has the focus
  isCurrentMonth: boolean; //	It is true for those days in the current day, and false for those days for the previous/next months shown around.
  isToday: boolean; //	It is true if this day is today
  isSelected: boolean; //	It is true if the date of this day is the selected one. In multiple select it is true if the date of this day is among the selected ones. In range selects, it is true if the date if this day is in the range, including both ends.
  isRangeStart?: boolean; //	It is true if this day is the beginning of a range. It is false in non-range calendars
  isRangeEnd?: boolean; //	It is true if this day is the end of a range. It is false in non-range calendars
  isDisabled: boolean; //	It is true if days are not in range for range calendars or are included in disabled dates.
}

export interface PowerCalendarSignature {
  Element: HTMLElement;
  Args: PowerCalendarArgs;
  Blocks: {
    default: [calendar: any];
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
  constructor(owner: unknown, args: PowerCalendarArgs) {
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
    return normalizeDate(center);
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PowerCalendar: typeof PowerCalendarComponent;
  }
}