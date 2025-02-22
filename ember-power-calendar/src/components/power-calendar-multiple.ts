import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import PowerCalendarMultipleDaysComponent, {
  type PowerCalendarMultipleDaysSignature,
} from './power-calendar-multiple/days.ts';
import PowerCalendarNavComponent, {
  type PowerCalendarNavSignature,
} from './power-calendar/nav.ts';
import { publicActionsObject } from '../-private/utils.ts';
import {
  normalizeDate,
  isSame,
  normalizeMultipleActionValue,
  normalizeCalendarValue,
  type NormalizeMultipleActionValue,
  type PowerCalendarDay,
} from '../utils.ts';
import type {
  CalendarAPI,
  CalendarDay,
  PowerCalendarAPI,
  PowerCalendarActions,
  PowerCalendarArgs,
  SelectedDays,
  TCalendarType,
} from './power-calendar.ts';
import type Owner from '@ember/owner';
import type { ComponentLike } from '@glint/template';
import type PowerCalendarService from '../services/power-calendar.ts';

export interface PowerCalendarMultipleAPI
  extends Omit<PowerCalendarAPI, 'selected' | 'DaysComponent'> {
  selected?: Date[];
  DaysComponent: ComponentLike<PowerCalendarMultipleDaysSignature>;
}

export type TPowerCalendarMultipleOnSelect = (
  day: NormalizeMultipleActionValue,
  calendar: PowerCalendarMultipleAPI,
  event: MouseEvent,
) => void;

interface PowerCalendarMultipleArgs
  extends Omit<PowerCalendarArgs, 'selected' | 'daysComponent' | 'onSelect'> {
  selected?: Date[];
  daysComponent?: string | ComponentLike<PowerCalendarMultipleDaysSignature>;
  onSelect?: TPowerCalendarMultipleOnSelect;
}

interface PowerCalendarMultipleDefaultBlock extends PowerCalendarMultipleAPI {
  Nav: ComponentLike<{
    Args: Omit<PowerCalendarNavSignature['Args'], 'calendar'>;
    Blocks: PowerCalendarNavSignature['Blocks'];
  }>;
  Days: ComponentLike<{
    Element: PowerCalendarMultipleDaysSignature['Element'];
    Args: Omit<PowerCalendarMultipleDaysSignature['Args'], 'calendar'>;
    Blocks: PowerCalendarMultipleDaysSignature['Blocks'];
  }>;
}

interface PowerCalendarMultipleSignature {
  Element: HTMLElement;
  Args: PowerCalendarMultipleArgs;
  Blocks: {
    default: [PowerCalendarMultipleDefaultBlock];
  };
}

export default class PowerCalendarMultipleComponent extends Component<PowerCalendarMultipleSignature> {
  @service declare powerCalendar: PowerCalendarService;

  @tracked center = null;
  @tracked _calendarType: TCalendarType = 'multiple';
  @tracked _selected?: SelectedDays;

  navComponent = PowerCalendarNavComponent;
  daysComponent = PowerCalendarMultipleDaysComponent;

  // Lifecycle hooks
  constructor(owner: Owner, args: PowerCalendarMultipleArgs) {
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

  get selected(): Date[] | undefined {
    if (this._selected) {
      return (this._selected as Date[]) || undefined;
    }

    const value = this.args.selected;

    if (!isArray(value)) {
      return value;
    }

    const selected: Date[] = [];

    for (const date of value) {
      const normalizedDate = normalizeDate(date);
      if (!(normalizedDate instanceof Date)) {
        continue;
      }
      selected.push(normalizedDate);
    }

    return selected;
  }

  set selected(v: SelectedDays) {
    this._selected = normalizeDate(v as Date | undefined);
  }

  get currentCenter(): Date {
    let center = this.args.center;
    if (!center) {
      center = (this.selected || [])[0] || this.powerCalendar.getDate();
    }
    return normalizeDate(center) || this.powerCalendar.getDate();
  }

  get publicAPI(): PowerCalendarAPI {
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
  select(dayOrDays: CalendarDay, calendar: CalendarAPI, e: MouseEvent) {
    assert(
      `The select action expects an array of date objects, or a date object. ${typeof dayOrDays} was recieved instead.`,
      isArray(dayOrDays) ||
        (dayOrDays instanceof Object && dayOrDays.date instanceof Date),
    );

    let days;

    if (isArray(dayOrDays)) {
      days = dayOrDays;
    } else if (dayOrDays instanceof Object && dayOrDays.date instanceof Date) {
      days = [dayOrDays];
    }

    if (this.args.onSelect) {
      this.args.onSelect(
        this._buildCollection((days as PowerCalendarDay[]) ?? []),
        calendar as PowerCalendarMultipleAPI,
        e,
      );
    }
  }

  // Methods
  _buildCollection(days: PowerCalendarDay[]): NormalizeMultipleActionValue {
    let selected = this.selected || [];

    for (const day of days) {
      const index = selected.findIndex((selectedDate) =>
        isSame(day.date, selectedDate, 'day'),
      );
      if (index === -1) {
        selected = [...selected, day.date];
      } else {
        selected = selected.slice(0, index).concat(selected.slice(index + 1));
      }
    }

    return normalizeMultipleActionValue({ date: selected });
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
}
