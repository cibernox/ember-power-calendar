import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import type {
  PowerCalendarDaysArgs,
  PowerCalendarDaysSignature,
} from '../power-calendar/days.ts';
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
} from '../../utils.ts';
import type { PowerCalendarRangeAPI } from '../power-calendar-range.ts';
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
  type TWeekdayFormat,
  type Week,
} from '../../-private/days-utils.ts';
import type PowerCalendarService from '../../services/power-calendar.ts';

interface PowerCalendarMultipleDaysArgs
  extends Omit<PowerCalendarDaysArgs, 'selected'> {
  selected?: {
    start: Date | null;
    end: Date | null;
  };
}

interface PowerCalendarRangeSignature
  extends Omit<PowerCalendarDaysSignature, 'Args'> {
  Args: PowerCalendarMultipleDaysArgs;
}

export default class PowerCalendarRangeDaysComponent extends Component<PowerCalendarRangeSignature> {
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
        this.buildDay(day, today, this.args.calendar as PowerCalendarRangeAPI),
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
}
