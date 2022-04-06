import { TaskGenerator } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';
import {
  add,
  normalizeCalendarValue,
  normalizeDate
} from 'ember-power-calendar-utils';

import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import type { Moment } from 'moment';
import type PowerCalendarService from '../../services/power-calendar';

export type TCalendarType = 'multiple' | 'range' | 'single';

export interface PowerCalendarDay {
  id: string; // A unique identified of the day. It has the format YYYY-MM-DD
  number: number; // The day's number. From 1 to 31
  date: Date; //	The native Date object representing that day.
  moment: Moment; //	The moment representing that day. (only when ember-power-calendar-moment is installed)
  isFocused: boolean; //	It is true when the the cell of that day has the focus
  isCurrentMonth: boolean; //	It is true for those days in the current day, and false for those days for the previous/next months shown around.
  isToday: boolean; //	It is true if this day is today
  isSelected: boolean; //	It is true if the date of this day is the selected one. In multiple select it is true if the date of this day is among the selected ones. In range selects, it is true if the date if this day is in the range, including both ends.
  isRangeStart: boolean; //	It is true if this day is the beginning of a range. It is false in non-range calendars
  isRangeEnd: boolean; //	It is true if this day is the end of a range. It is false in non-range calendars
  isDisabled: boolean;
}

export interface PowerCalendarActions {
  changeCenter?: (newCenter: Date, calendar: PowerCalendarAPI, event: MouseEvent) => void;
  moveCenter?: (
    step: number,
    unit: 'year' | 'month',
    calendar: PowerCalendarAPI,
    event: MouseEvent
  ) => void;
  select?: (day: Date, calendar: PowerCalendarAPI, event: MouseEvent) => void;
}

export interface PowerCalendarAPI<T = PowerCalendarDay> {
  uniqueId: string;
  selected: T;
  loading: boolean;
  center: Date;
  locale: string;
  type: TCalendarType;
  actions: PowerCalendarActions;
}

interface IArgs {
  selected?: unknown;
  tag?: string;
  onSelect?: (day: TSelected, calendar: PowerCalendarAPI, event: MouseEvent) => void;
  onCenterChange?: (newCenter: number, calendar: PowerCalendarAPI, event: MouseEvent) => void;
  onInit: (calendar: PowerCalendarAPI) => void;
  proximitySelection?: boolean;
  locale: string;
  minRange?: number;
  maxRange?: number;
  center?: Date;
}

interface TSelected {
  selected?: Date;
}

interface WindowWithCalendar extends Window {
  __powerCalendars?: Record<string, PowerCalendar>;
}

declare var window: WindowWithCalendar;

export default class PowerCalendar<T = TSelected> extends Component<T & IArgs> {
  @service declare powerCalendar: PowerCalendarService;
  // Range
  @tracked proximitySelection: boolean = this.args.proximitySelection ?? false;

  navComponent = 'power-calendar/nav';
  daysComponent = 'power-calendar/days';
  center = null;
  _calendarType: TCalendarType = 'single';

  // Lifecycle hooks
  constructor(owner: any, args: T & IArgs) {
    super(owner, args);
    this.registerCalendar();

    const { onInit } = this.args;
    if (onInit) {
      onInit(this.publicAPI);
    }
  }

  willDestroy() {
    this.unregisterCalendar();
  }

  // Methods

  get publicActions(): PowerCalendarActions {
    const { onSelect, onCenterChange } = this.args;
    const actions: PowerCalendarActions = {};
    if (onSelect) {
      actions.select = (day, calendar, e) => this.select(day, calendar, e);
    }
    if (onCenterChange) {
      const changeCenter = (newCenter: Date, calendar: PowerCalendarAPI, e: MouseEvent) => {
        return taskFor(this.changeCenterTask).perform(newCenter, calendar, e);
      };
      actions.changeCenter = changeCenter;
      actions.moveCenter = (step, unit, calendar, e) => {
        const newCenter = add(this.currentCenter, step, unit);
        return changeCenter(newCenter, calendar, e);
      };
    }

    return actions;
  }

  get selected() {
    const { selected } = this.args;
    return normalizeDate(selected);
  }

  get currentCenter() {
    let center = this.args.center;
    if (!center) {
      center = this.selected || this.powerCalendar.getDate();
    }
    return normalizeDate(center);
  }

  get publicAPI() {
    return this._publicAPI;
  }

  get _publicAPI() {
    return {
      uniqueId: guidFor(this),
      type: this._calendarType,
      selected: this.selected,
      loading: taskFor(this.changeCenterTask).isRunning,
      center: this.currentCenter,
      locale: this.args.locale || this.powerCalendar.locale,
      actions: this.publicActions
    };
  }

  get defaultTag() {
    return this.args.tag ?? 'div';
  }

  // Actions
  @action
  select<T = Date>(day: T, calendar: PowerCalendarAPI, e: MouseEvent) {
    if (this.args.onSelect) {
      this.args.onSelect(day, calendar, e);
    }
  }

  // Tasks
  @task
  *changeCenterTask(
    newCenter: Date,
    calendar: PowerCalendarAPI,
    e: MouseEvent
  ): TaskGenerator<void> {
    const { onCenterChange } = this.args;
    assert(
      "You attempted to move the center of a calendar that doesn't receive an `@onCenterChange` action.",
      typeof onCenterChange === 'function'
    );
    const value = normalizeCalendarValue({ date: newCenter });

    return yield onCenterChange(value, calendar, e);
  }

  // Methods
  registerCalendar() {
    if (window) {
      window.__powerCalendars = window.__powerCalendars || {}; // TODO: weakmap??
      window.__powerCalendars[this.publicAPI.uniqueId] = this;
    }
  }

  unregisterCalendar() {
    if (window && window.__powerCalendars?.[guidFor(this)]) {
      delete window.__powerCalendars[guidFor(this)];
    }
  }
}
