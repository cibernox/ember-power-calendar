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
import type { CalendarAPI, PowerCalendarDay } from '../power-calendar.ts';
import type PowerCalendarService from '../../services/power-calendar.ts';
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
  type TWeekdayFormat,
  type Week,
} from '../../-private/days-utils.ts';

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
    return normalizeDate(center);
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
      this.focusedId,
    );
  }

  @action
  handleClick(e: MouseEvent) {
    handleClick(e, this.days, this.args.calendar);
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
}
