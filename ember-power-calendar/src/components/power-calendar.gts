import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import service from '../-private/service.ts';
import { task, type TaskInstance } from 'ember-concurrency';
import { assert } from '@ember/debug';
import { element } from 'ember-element-helper';
import { hash } from '@ember/helper';
import {
  normalizeDate,
  normalizeCalendarValue,
  type NormalizeCalendarValue,
  type PowerCalendarDay,
  type SelectedPowerCalendarRange,
  add,
} from '../utils.ts';
import PowerCalendarNavComponent, {
  type PowerCalendarNavSignature,
} from './power-calendar/nav.gts';
import PowerCalendarDaysComponent, {
  type PowerCalendarDaysSignature,
} from './power-calendar/days.gts';
import type { ComponentLike } from '@glint/template';
import type Owner from '@ember/owner';
import type PowerCalendarService from '../services/power-calendar.ts';
// import type {
//   // PowerCalendarRangeAPI,
//   PowerCalendarRangeDay,
// } from './power-calendar-range.ts';
// import type { PowerCalendarMultipleAPI } from './power-calendar-multiple.ts';

export type TCalendarType = 'multiple' | 'range' | 'single';
export type TPowerCalendarMoveCenterUnit = 'year' | 'month';
export type SelectedDays =
  | SelectedPowerCalendarRange
  | Date
  | Date[]
  | undefined;
// export type CalendarAPI =
//   | PowerCalendarAPI
//   | PowerCalendarMultipleAPI
//   | PowerCalendarRangeAPI;

export interface PowerCalendarAPI {
  uniqueId: string;
  calendarUniqueId?: string;
  selected?: SelectedDays;
  loading: boolean;
  center: Date;
  locale: string;
  type: 'single';
  actions: PowerCalendarActions;
}

export interface PowerCalendarActions {
  changeCenter?: (
    newCenter: Date,
    calendar: PowerCalendarAPI,
    event: MouseEvent,
  ) => TaskInstance<void>;
  moveCenter?: (
    step: number,
    unit: TPowerCalendarMoveCenterUnit,
    calendar: PowerCalendarAPI,
    event: MouseEvent | KeyboardEvent,
  ) => Promise<void>;
  select?: (
    day: PowerCalendarDay,
    calendar: PowerCalendarAPI,
    event: MouseEvent,
  ) => void;
}

export type TPowerCalendarOnSelect = (
  day: PowerCalendarDay,
  calendar: PowerCalendarAPI,
  event?: Event,
) => void;

export interface PowerCalendarArgs {
  daysComponent?: ComponentLike<PowerCalendarDaysSignature>;
  locale?: string;
  navComponent?: ComponentLike<PowerCalendarNavSignature>;
  onCenterChange?: (
    newCenter: NormalizeCalendarValue,
    calendar: PowerCalendarAPI,
    event: Event,
  ) => Promise<void> | void;
  onInit?: (calendar: PowerCalendarAPI) => void;
  onSelect?: TPowerCalendarOnSelect;
  selected?: SelectedDays;
  center?: Date;
  tag?: keyof HTMLElementTagNameMap;
  ariaLabel?: boolean;
  ariaLabeledBy?: boolean;
  isDatePicker?: boolean;
  autofocus?: boolean;
}

export interface PowerCalendarDefaultBlock extends PowerCalendarAPI {
  Nav: ComponentLike<{
    Args: Omit<PowerCalendarNavSignature['Args'], 'calendar'>;
    Blocks: PowerCalendarNavSignature['Blocks'];
  }>;
  Days: ComponentLike<{
    Element: PowerCalendarDaysSignature['Element'];
    Args: Omit<PowerCalendarDaysSignature['Args'], 'calendar'>;
    Blocks: PowerCalendarDaysSignature['Blocks'];
  }>;
}

// ToDO: Refactor this!! no general type!
// export type CalendarDay =
//   | PowerCalendarDay
//   | PowerCalendarRangeDay
//   | PowerCalendarDay[];

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

  // Lifecycle hooks
  constructor(owner: Owner, args: PowerCalendarArgs) {
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
    const onSelect = this.args.onSelect;
    const select = this.select.bind(this);
    const onCenterChange = this.args.onCenterChange;
    const changeCenterTask = this.changeCenterTask;
    const currentCenter = this.currentCenter;

    const actions: PowerCalendarActions = {};
    if (onSelect) {
      actions.select = (...args) => select(...args);
    }
    if (onCenterChange) {
      const changeCenter = (
        newCenter: Date,
        calendar: PowerCalendarAPI,
        e: Event,
      ) => {
        return changeCenterTask.perform(newCenter, calendar, e);
      };
      actions.changeCenter = changeCenter;
      actions.moveCenter = async (step, unit, calendar, e) => {
        const newCenter = add(currentCenter, step, unit);
        return await changeCenter(newCenter, calendar, e);
      };
    }

    return actions;
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
      type: 'single',
      selected: this.selected,
      loading: this.changeCenterTask.isRunning,
      center: this.currentCenter,
      locale: this.args.locale || this.powerCalendar.locale,
      actions: this.publicActions,
    };
  }

  get tagWithDefault(): keyof HTMLElementTagNameMap {
    if (this.args.tag === undefined || this.args.tag === null) {
      return 'div';
    }
    return this.args.tag;
  }

  get navComponent(): ComponentLike<PowerCalendarNavSignature> {
    return (
      this.args.navComponent ||
      (PowerCalendarNavComponent as ComponentLike<PowerCalendarNavSignature>)
    );
  }

  get daysComponent(): ComponentLike<PowerCalendarDaysSignature> {
    return (
      this.args.daysComponent ||
      (PowerCalendarDaysComponent as ComponentLike<PowerCalendarDaysSignature>)
    );
  }

  calendarAPI(
    publicAPI: PowerCalendarAPI,
    components: {
      Nav: ComponentLike<PowerCalendarNavSignature>;
      Days: ComponentLike<PowerCalendarDaysSignature>;
    },
  ): PowerCalendarDefaultBlock {
    return Object.assign(
      {},
      publicAPI,
      components,
    ) as PowerCalendarDefaultBlock;
  }

  // Tasks
  changeCenterTask = task(
    async (newCenter: Date, calendar: PowerCalendarAPI, e: Event) => {
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
  select(day: PowerCalendarDay, calendar: PowerCalendarAPI, e?: Event) {
    if (this.args.onSelect) {
      this.args.onSelect(day, calendar, e);
    }
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
            (unless @ariaLabeledBy "Choose Date")
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
