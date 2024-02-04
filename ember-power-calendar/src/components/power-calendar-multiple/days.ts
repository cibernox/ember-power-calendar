import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import {
  add,
  getWeekdays,
  getWeekdaysMin,
  getWeekdaysShort,
  isBefore,
  isSame,
  normalizeDate,
  withLocale,
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
import type { CalendarAPI, PowerCalendarDay } from '../power-calendar.ts';
import type PowerCalendarService from '../../services/power-calendar.ts';
import type {
  PowerCalendarDaysArgs,
  PowerCalendarDaysSignature,
} from '../power-calendar/days.ts';

interface PowerCalendarMultipleDaysArgs
  extends Omit<PowerCalendarDaysArgs, 'selected'> {
  selected?: Date[];
  maxLength?: number;
}

interface PowerCalendarMultipleDaysSignature
  extends Omit<PowerCalendarDaysSignature, 'Args'> {
  Args: PowerCalendarMultipleDaysArgs;
}

export default class PowerCalendarMultipleDaysComponent extends Component<PowerCalendarMultipleDaysSignature> {
  @service declare powerCalendar: PowerCalendarService;

  @tracked focusedId: string | null = null;

  get weekdayFormat(): TWeekdayFormat {
    return this.args.weekdayFormat || 'short'; // "min" | "short" | "long"
  }

  get showDaysAround(): boolean {
    return this.args.showDaysAround !== undefined
      ? this.args.showDaysAround
      : true;
  }

  get weekdaysMin(): string[] {
    return withLocale(this.args.calendar.locale, getWeekdaysMin);
  }

  get weekdaysShort(): string[] {
    return withLocale(this.args.calendar.locale, getWeekdaysShort);
  }

  get weekdays(): string[] {
    return withLocale(this.args.calendar.locale, getWeekdays);
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
    return normalizeDate(center);
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
      this._updateFocused,
      (e.target as HTMLElement).dataset['date'],
    );
  }

  @action
  handleDayBlur(): void {
    scheduleOnce('actions', this, this._updateFocused, null);
  }

  @action
  handleKeyDown(e: KeyboardEvent): void {
    const day = handleDayKeyDown(e, this.focusedId, this.days);
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
}
