import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import service from '../../-private/service.ts';
import emberPowerCalendarDayClasses from '../../helpers/ember-power-calendar-day-classes.ts';
import { or } from 'ember-truth-helpers';
import {
  isBetween,
  isSame,
  diff,
  isBefore,
  add,
  withLocale,
  getWeekdaysMin,
  getWeekdaysShort,
  getWeekdays,
  normalizeDate,
  type PowerCalendarDay,
  formatDate,
} from '../../utils.ts';
import {
  buildDay,
  firstDay,
  lastDay,
  localeStartOfWeekOrFallback,
  weekdaysNames,
  weeks,
  handleDayKeyDown,
  focusDate,
  handleClick,
  dayIsDisabled,
  DAY_IN_MS,
  type TWeekdayFormat,
  type Week,
} from '../../-private/days-utils.ts';
import { modifier } from 'ember-modifier';
import { on } from '@ember/modifier';
import type {
  PowerCalendarDaysArgs,
  PowerCalendarDaysSignature,
} from '../power-calendar/days.ts';
import type { PowerCalendarRangeAPI } from '../power-calendar-range.ts';
import type PowerCalendarService from '../../services/power-calendar.ts';

interface PowerCalendarMultipleDaysArgs
  extends Omit<PowerCalendarDaysArgs, 'calendar' | 'selected'> {
  calendar: PowerCalendarRangeAPI;
  selected?: {
    start: Date | null;
    end: Date | null;
  };
}

export interface PowerCalendarRangeDaysSignature
  extends Omit<PowerCalendarDaysSignature, 'Args'> {
  Args: PowerCalendarMultipleDaysArgs;
}

export default class PowerCalendarRangeDaysComponent extends Component<PowerCalendarRangeDaysSignature> {
  @service declare powerCalendar: PowerCalendarService;

  @tracked focusedId: string | null = null;

  didSetup = false;
  lastKeyDownWasSpace = false;

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
      days.push(this.buildDay(day, today, this.args.calendar));
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
      center = this.args.selected?.start || this.args.calendar.center;
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
    this.lastKeyDownWasSpace = e.code === 'Space';

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
  async handleClick(e: MouseEvent) {
    const selectedDay = handleClick(e, this.days, this.args.calendar);

    if (
      this.lastKeyDownWasSpace &&
      selectedDay &&
      (this.args.calendar.minRange ?? 0) > 0 &&
      !this.args.calendar.selected?.end
    ) {
      const focusDay = add(
        selectedDay.date,
        (this.args.calendar.minRange ?? 0) / DAY_IN_MS,
        'day',
      );
      const dayInCurrentCalendar = this.days.some(
        (x) => x.id === formatDate(focusDay, 'YYYY-MM-DD') && x.isCurrentMonth,
      );

      await this.focusDay(e, focusDay, dayInCurrentCalendar ? 0 : 1);
    }

    this.lastKeyDownWasSpace = false;
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
  buildDay(date: Date, today: Date, calendar: PowerCalendarRangeAPI) {
    const day = buildDay(
      date,
      today,
      calendar,
      this.focusedId,
      this.currentCenter,
      this.dayIsSelected.bind(this),
      this.args.minDate,
      this.args.maxDate,
      this.args.disabledDates,
    );

    const { start, end } = calendar.selected || { start: null, end: null };
    if (start && end) {
      day.isSelected = isBetween(date, start, end, 'day', '[]');
      day.isRangeStart = day.isSelected && isSame(date, start, 'day');
      day.isRangeEnd = day.isSelected && isSame(date, end, 'day');
    } else {
      day.isRangeEnd = false;
      if (!start) {
        day.isRangeStart = false;
      } else {
        day.isRangeStart = day.isSelected = isSame(date, start, 'day');
        if (!day.isDisabled) {
          const diffInMs = Math.abs(diff(day.date, start));
          const minRange = calendar.minRange;
          const maxRange = calendar.maxRange;
          day.isDisabled =
            (minRange && diffInMs < minRange) ||
            (maxRange !== null &&
              maxRange !== undefined &&
              diffInMs > maxRange);
        }
      }
    }
    return day;
  }

  dayIsSelected() {
    return false;
  }

  _updateFocused(id?: string | null) {
    this.focusedId = id ?? null;
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
