import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import service from '../-private/service.ts';
import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import { action } from '@ember/object';
import { task, type TaskInstance } from 'ember-concurrency';
import PowerCalendarMultipleDaysComponent, {
  type PowerCalendarMultipleDaysSignature,
} from './power-calendar-multiple/days.gts';
import PowerCalendarMultipleNavComponent, {
  type PowerCalendarMultipleNavSignature,
} from './power-calendar-multiple/nav.gts';
import {
  normalizeDate,
  isSame,
  normalizeMultipleActionValue,
  normalizeCalendarValue,
  type NormalizeMultipleActionValue,
  type PowerCalendarDay,
  type NormalizeCalendarValue,
  add,
} from '../utils.ts';
import type {
  // CalendarDay,
  PowerCalendarAPI,
  PowerCalendarArgs,
  SelectedDays,
  TPowerCalendarMoveCenterUnit,
} from './power-calendar.ts';
import type Owner from '@ember/owner';
import type { ComponentLike } from '@glint/template';
import type PowerCalendarService from '../services/power-calendar.ts';
import { hash } from '@ember/helper';
import { element } from 'ember-element-helper';

export interface PowerCalendarMultipleActions {
  changeCenter?: (
    newCenter: Date,
    calendar: PowerCalendarMultipleAPI,
    event: MouseEvent,
  ) => TaskInstance<void>;
  moveCenter?: (
    step: number,
    unit: TPowerCalendarMoveCenterUnit,
    calendar: PowerCalendarMultipleAPI,
    event: MouseEvent | KeyboardEvent,
  ) => Promise<void>;
  select?: (
    day: PowerCalendarDay | PowerCalendarDay[],
    calendar: PowerCalendarMultipleAPI,
    event: MouseEvent,
  ) => void;
}

export interface PowerCalendarMultipleAPI
  extends Omit<PowerCalendarAPI, 'type' | 'selected' | 'actions'> {
  type: 'multiple';
  selected?: Date[];
  actions: PowerCalendarMultipleActions;
}

export type TPowerCalendarMultipleOnSelect = (
  day: NormalizeMultipleActionValue,
  calendar: PowerCalendarMultipleAPI,
  event?: Event,
) => void;

interface PowerCalendarMultipleArgs
  extends Omit<
    PowerCalendarArgs,
    | 'navComponent'
    | 'daysComponent'
    | 'selected'
    | 'onSelect'
    | 'onCenterChange'
    | 'onInit'
  > {
  navComponent?: ComponentLike<PowerCalendarMultipleNavSignature>;
  daysComponent?: ComponentLike<PowerCalendarMultipleDaysSignature>;
  selected?: Date[];
  onSelect?: TPowerCalendarMultipleOnSelect;
  onInit?: (calendar: PowerCalendarMultipleAPI) => void;
  onCenterChange?: (
    newCenter: NormalizeCalendarValue,
    calendar: PowerCalendarMultipleAPI,
    event: Event,
  ) => Promise<void> | void;
}

interface PowerCalendarMultipleDefaultBlock extends PowerCalendarMultipleAPI {
  Nav: ComponentLike<{
    Args: Omit<PowerCalendarMultipleNavSignature['Args'], 'calendar'>;
    Blocks: PowerCalendarMultipleNavSignature['Blocks'];
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
  @tracked _selected?: SelectedDays;

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

  get publicActions(): PowerCalendarMultipleActions {
    const onSelect = this.args.onSelect;
    const select = this.select.bind(this);
    const onCenterChange = this.args.onCenterChange;
    const changeCenterTask = this.changeCenterTask;
    const currentCenter = this.currentCenter;

    const actions: PowerCalendarMultipleActions = {};
    if (onSelect) {
      actions.select = (...args) => select(...args);
    }
    if (onCenterChange) {
      const changeCenter = (
        newCenter: Date,
        calendar: PowerCalendarMultipleAPI,
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

  get publicAPI(): PowerCalendarMultipleAPI {
    return {
      uniqueId: guidFor(this),
      type: 'multiple',
      selected: this.selected,
      loading: this.changeCenterTask.isRunning,
      center: this.currentCenter,
      locale: this.args.locale || this.powerCalendar.locale,
      actions: this.publicActions,
    };
  }

  get tagWithDefault(): keyof HTMLElementTagNameMap | '' {
    if (this.args.tag === undefined || this.args.tag === null) {
      return 'div';
    }
    return this.args.tag;
  }

  get navComponent(): ComponentLike<PowerCalendarMultipleNavSignature> {
    return (
      this.args.navComponent ||
      (PowerCalendarMultipleNavComponent as ComponentLike<PowerCalendarMultipleNavSignature>)
    );
  }

  get daysComponent(): ComponentLike<PowerCalendarMultipleDaysSignature> {
    return (
      this.args.daysComponent ||
      (PowerCalendarMultipleDaysComponent as ComponentLike<PowerCalendarMultipleDaysSignature>)
    );
  }

  calendarAPI(
    publicAPI: PowerCalendarMultipleAPI,
    components: {
      Nav: ComponentLike<PowerCalendarMultipleNavSignature>;
      Days: ComponentLike<PowerCalendarMultipleDaysSignature>;
    },
  ): PowerCalendarMultipleDefaultBlock {
    return Object.assign(
      {},
      publicAPI,
      components,
    ) as PowerCalendarMultipleDefaultBlock;
  }

  // Tasks
  changeCenterTask = task(
    async (newCenter: Date, calendar: PowerCalendarMultipleAPI, e: Event) => {
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
  select(
    dayOrDays: PowerCalendarDay | PowerCalendarDay[],
    calendar: PowerCalendarMultipleAPI,
    e?: Event,
  ) {
    console.log('dayOrDays', dayOrDays);
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
        calendar,
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
            (unless @ariaLabeledBy "Choose Multiple Dates")
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
