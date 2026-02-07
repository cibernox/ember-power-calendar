import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { modifier } from 'ember-modifier';
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
import {
  firstDay,
  localeStartOfWeekOrFallback,
  weekdaysNames,
  weeks,
  handleDayKeyDown,
  focusDate,
  buildDay,
  lastDay,
  handleClick,
  dayIsDisabled,
  type TWeekdayFormat,
  type Week,
} from '../../-private/days-utils.ts';
import { or } from 'ember-truth-helpers';
import { on } from '@ember/modifier';
import emberPowerCalendarDayClasses from '../../helpers/ember-power-calendar-day-classes.ts';
import type { CalendarAPI } from '../power-calendar.ts';
import type PowerCalendarService from '../../services/power-calendar.ts';

export interface PowerCalendarDaysArgs {
  calendar: CalendarAPI;
  dayClass?: string;
  disabledDates?: Array<Date | string>;
  maxDate?: Date;
  minDate?: Date;
  selected?: Date;
  showDaysAround?: boolean;
  startOfWeek?: string;
  center?: Date;
  weekdayFormat?: TWeekdayFormat;
  autofocus?: boolean;
  isDatePicker?: boolean;
}

export interface PowerCalendarDaysSignature {
  Element: HTMLElement;
  Args: PowerCalendarDaysArgs;
  Blocks: {
    default: [day: PowerCalendarDay, calendar: CalendarAPI, weeks: Week[]];
  };
}

export default class PowerCalendarDaysComponent extends Component<PowerCalendarDaysSignature> {
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
      center = this.args.selected || this.args.calendar.center;
    }
    return normalizeDate(center) || this.args.calendar.center;
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
    return calendar.selected
      ? isSame(date, calendar.selected as Date, 'day')
      : false;
  }

  _updateFocused(id?: string | null) {
    this.focusedId = id ?? null;
  }

  <template>
    {{! template-lint-disable no-invalid-interactive }}
    <div
      class="ember-power-calendar-days"
      data-power-calendar-id={{or @calendar.calendarUniqueId @calendar.uniqueId}}
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
