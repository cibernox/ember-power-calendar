import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import service from '../../-private/service.ts';
import {
  add,
  formatDate,
  getWeekdays,
  getWeekdaysMin,
  getWeekdaysShort,
  isBefore,
  isSame,
  normalizeDate,
  withLocale,
  type PowerCalendarDay,
} from '../../utils.ts';
import type { PowerCalendarMultipleAPI } from '../power-calendar-multiple.ts';
import {
  buildDay,
  dayIsDisabled,
  firstDay,
  lastDay,
  localeStartOfWeekOrFallback,
  weekdaysNames,
  weeks,
  handleDayKeyDown,
  focusDate,
  handleClick,
  type TWeekdayFormat,
  type Week,
} from '../../-private/days-utils.ts';
import { modifier } from 'ember-modifier';
import { or } from 'ember-truth-helpers';
import { on } from '@ember/modifier';
import emberPowerCalendarDayClasses from '../../helpers/ember-power-calendar-day-classes.ts';
import type { CalendarAPI } from '../power-calendar.ts';
import type PowerCalendarService from '../../services/power-calendar.ts';
import type {
  PowerCalendarDaysArgs,
  PowerCalendarDaysSignature,
} from '../power-calendar/days.ts';

interface PowerCalendarMultipleDaysArgs
  extends Omit<PowerCalendarDaysArgs, 'calendar' | 'selected'> {
  calendar: PowerCalendarMultipleAPI;
  selected?: Date[];
  maxLength?: number;
}

export interface PowerCalendarMultipleDaysSignature
  extends Omit<PowerCalendarDaysSignature, 'Args'> {
  Args: PowerCalendarMultipleDaysArgs;
}

export default class PowerCalendarMultipleDaysComponent extends Component<PowerCalendarMultipleDaysSignature> {
  @service declare powerCalendar: PowerCalendarService;

  @tracked focusedId: string | null = null;

  didSetup = false;

  get weekdayFormat(): TWeekdayFormat {
    return this.args.weekdayFormat || 'short'; // "min" | "short" | "long"
  }

  get showDaysAround(): boolean {
    return this.args.showDaysAround !== undefined
      ? this.args.showDaysAround
      : true;
  }

  get weekdaysMin(): string[] {
    return withLocale(this.args.calendar.locale, getWeekdaysMin) as string[];
  }

  get weekdaysShort(): string[] {
    return withLocale(this.args.calendar.locale, getWeekdaysShort) as string[];
  }

  get weekdays(): string[] {
    return withLocale(this.args.calendar.locale, getWeekdays) as string[];
  }

  get localeStartOfWeek(): number {
    return localeStartOfWeekOrFallback(
      this.args.startOfWeek,
      this.args.calendar.locale,
    );
  }

  get weekdaysNames(): string[] {
    return weekdaysNames(
      this.localeStartOfWeek,
      this.weekdayFormat,
      this.weekdays,
      this.weekdaysMin,
      this.weekdaysShort,
    );
  }

  get days(): PowerCalendarDay[] {
    const today = this.powerCalendar.getDate();
    const theLastDay = lastDay(this.localeStartOfWeek, this.currentCenter);
    let day = firstDay(this.currentCenter, this.localeStartOfWeek);
    const days: PowerCalendarDay[] = [];
    while (isBefore(day, theLastDay)) {
      days.push(
        buildDay(
          day,
          today,
          this.args.calendar,
          this.focusedId,
          this.currentCenter,
          this.dayIsSelected.bind(this),
          this.args.minDate,
          this.args.maxDate,
          this.args.disabledDates,
          this.dayIsDisabled.bind(this),
        ),
      );
      day = add(day, 1, 'day');
    }
    return days;
  }

  get weeks(): Week[] {
    return weeks(this.days, this.showDaysAround);
  }

  get currentCenter(): Date {
    let center = this.args.center;
    if (!center) {
      center = this.args.selected
        ? this.args.selected[0]
        : this.args.calendar.center;
    }
    return normalizeDate(center) || this.args.calendar.center;
  }

  get maxLength(): number {
    return this.args.maxLength || Infinity;
  }

  // Actions
  @action
  handleDayFocus(e: FocusEvent): void {
    scheduleOnce(
      'actions',
      this,
      this._updateFocused.bind(this),
      (e.target as HTMLElement).dataset['date'],
    );
  }

  @action
  handleDayBlur(): void {
    scheduleOnce('actions', this, this._updateFocused.bind(this), null);
  }

  @action
  async handleKeyDown(e: KeyboardEvent): Promise<void> {
    const day = handleDayKeyDown(e, this.focusedId, this.days);

    if (!day || !day?.isCurrentMonth) {
      if (this.args.calendar.actions.moveCenter) {
        if (
          e.key === 'ArrowUp' ||
          e.key === 'ArrowRight' ||
          e.key === 'ArrowDown' ||
          e.key === 'ArrowLeft'
        ) {
          const currentDay = this.days.find(
            (x) => x.id === this.focusedId,
          )?.date;

          if (currentDay) {
            let date = currentDay;
            let step = 1;
            if (e.key === 'ArrowUp') {
              date = add(currentDay, -7, 'day');
              step = -1;
            } else if (e.key === 'ArrowLeft') {
              date = add(currentDay, -1, 'day');
              step = -1;
            } else if (e.key === 'ArrowRight') {
              date = add(currentDay, 1, 'day');
            } else if (e.key === 'ArrowDown') {
              date = add(currentDay, 7, 'day');
            }

            await this.focusDay(e, date, step);

            return;
          }
        }
      }
    }

    if (!day) {
      return;
    }

    this.focusedId = day.id;
    scheduleOnce(
      'afterRender',
      this,
      focusDate,
      this.args.calendar.uniqueId,
      this.focusedId ?? '',
    );
  }

  @action
  handleClick(e: MouseEvent) {
    handleClick(e, this.days, this.args.calendar);
  }

  setup = modifier(
    () => {
      if (this.didSetup) {
        return;
      }

      this.didSetup = true;

      if (this.args.autofocus) {
        scheduleOnce('afterRender', this, this.initialFocus.bind(this));
      }
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    { eager: false },
  );

  initialFocus() {
    const activeDay = this.days.find((x) => x.isSelected && !x.isDisabled);

    if (activeDay) {
      this.focusedId = activeDay.id;
    } else {
      const todayDay = this.days.find((x) => x.isToday && !x.isDisabled);
      if (todayDay) {
        this.focusedId = todayDay.id ?? '';
      } else {
        const firstSelectableDay = this.days.find((x) => !x.isDisabled);
        if (firstSelectableDay) {
          this.focusedId = firstSelectableDay.id ?? '';
        } else {
          this.focusedId = this.days.find((x) => !x.isCurrentMonth)?.id ?? '';
        }
      }
    }

    focusDate(this.args.calendar.uniqueId, this.focusedId ?? '');
  }

  async focusDay(e: MouseEvent | KeyboardEvent, date: Date, step: number = 0) {
    if (
      dayIsDisabled(
        date,
        this.args.calendar,
        this.args.minDate,
        this.args.maxDate,
        this.args.disabledDates,
      )
    ) {
      return;
    }

    if (this.args.calendar.actions.moveCenter && step !== 0) {
      await this.args.calendar.actions.moveCenter(
        step,
        'month',
        this.args.calendar,
        e,
      );
    }

    this.focusedId = formatDate(date, 'YYYY-MM-DD');

    if (step !== 0) {
      scheduleOnce(
        'afterRender',
        this,
        focusDate,
        this.args.calendar.uniqueId,
        this.focusedId ?? '',
      );
    } else {
      focusDate(this.args.calendar.uniqueId, this.focusedId ?? '');
    }
  }

  // Methods
  dayIsSelected(date: Date, calendar: CalendarAPI = this.args.calendar) {
    const selected = (calendar as PowerCalendarMultipleAPI).selected || [];
    return selected.some((d) => isSame(date, d, 'day'));
  }

  _updateFocused(id?: string | null) {
    this.focusedId = id ?? null;
  }

  dayIsDisabled(
    date: Date,
    calendarApi: CalendarAPI,
    minDate?: Date,
    maxDate?: Date,
    disabledDates?: Array<Date | string>,
  ) {
    const calendar = calendarApi as PowerCalendarMultipleAPI;
    const numSelected = (calendar.selected && calendar.selected.length) || 0;
    const maxLength = this.maxLength || Infinity;
    return (
      dayIsDisabled(date, calendar, minDate, maxDate, disabledDates) ||
      (numSelected >= maxLength && !this.dayIsSelected(date))
    );
  }

  <template>
    {{! template-lint-disable no-invalid-interactive }}
    <div
      class="ember-power-calendar-days"
      data-power-calendar-id={{or
        @calendar.calendarUniqueId
        @calendar.uniqueId
      }}
      role="grid"
      aria-labelledby="ember-power-calendar-nav-title-{{@calendar.uniqueId}}"
      {{on "click" this.handleClick}}
      {{this.setup}}
      ...attributes
    >
      <div
        class="ember-power-calendar-row ember-power-calendar-weekdays"
        role="row"
      >
        {{#each this.weekdaysNames as |wdn|}}
          <div
            class="ember-power-calendar-weekday"
            role="columnheader"
          >{{wdn}}</div>
        {{/each}}
      </div>
      <div
        class="ember-power-calendar-day-grid"
        role="rowgroup"
        {{on "keydown" this.handleKeyDown}}
      >
        {{#each this.weeks key="id" as |week|}}
          <div
            class="ember-power-calendar-row ember-power-calendar-week"
            role="row"
            data-missing-days={{week.missingDays}}
          >
            {{#each week.days key="id" as |day|}}
              <button
                type="button"
                role="gridcell"
                data-date="{{day.id}}"
                class={{emberPowerCalendarDayClasses
                  day
                  @calendar
                  this.weeks
                  @dayClass
                }}
                {{on "focus" this.handleDayFocus}}
                {{on "blur" this.handleDayBlur}}
                disabled={{day.isDisabled}}
                tabindex={{if day.isFocused "0" "-1"}}
                aria-selected={{if day.isSelected "true"}}
              >
                {{#if (has-block)}}
                  {{yield day @calendar this.weeks}}
                {{else}}
                  {{day.number}}
                {{/if}}
              </button>
            {{/each}}
          </div>
        {{/each}}
      </div>
    </div>
  </template>
}
