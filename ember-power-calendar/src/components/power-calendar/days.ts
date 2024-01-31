import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';
import {
  add,
  endOf,
  endOfWeek,
  formatDate,
  getWeekdays,
  getWeekdaysMin,
  getWeekdaysShort,
  isAfter,
  isBefore,
  isSame,
  localeStartOfWeek,
  normalizeCalendarDay,
  normalizeDate,
  startOf,
  startOfWeek,
  withLocale,
} from '../../utils.ts';
import type { CalendarAPI, PowerCalendarDay } from '../power-calendar.ts';
import type PowerCalendarService from '../../services/power-calendar.ts';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
  weekdayFormat?: 'min' | 'short' | 'long';
}

export interface PowerCalendarDaysSignature {
  Element: HTMLElement;
  Args: PowerCalendarDaysArgs;
  Blocks: {
    default: [day: PowerCalendarDay, calendar: CalendarAPI, weeks: string[]];
  };
}

export default class PowerCalendarDaysComponent<T> extends Component<
  T & PowerCalendarDaysSignature
> {
  @service declare powerCalendar: PowerCalendarService;

  @tracked focusedId: string | null = null;

  get weekdayFormat(): string {
    return this.args.weekdayFormat || 'short'; // "min" | "short" | "long"
  }

  get showDaysAround(): boolean {
    return this.args.showDaysAround !== undefined
      ? this.args.showDaysAround
      : true;
  }

  get weekdaysMin() {
    return withLocale(this.args.calendar.locale, getWeekdaysMin);
  }

  get weekdaysShort() {
    return withLocale(this.args.calendar.locale, getWeekdaysShort);
  }

  get weekdays() {
    return withLocale(this.args.calendar.locale, getWeekdays);
  }

  get localeStartOfWeek(): number {
    const forcedStartOfWeek = this.args.startOfWeek;
    if (forcedStartOfWeek) {
      return parseInt(forcedStartOfWeek, 10);
    }
    return localeStartOfWeek(this.args.calendar.locale);
  }

  get weekdaysNames() {
    const { localeStartOfWeek, weekdayFormat } = this;
    let weekdaysNames;
    if (weekdayFormat === 'long') {
      weekdaysNames = this.weekdays;
    } else if (weekdayFormat === 'min') {
      weekdaysNames = this.weekdaysMin;
    } else {
      weekdaysNames = this.weekdaysShort;
    }
    return weekdaysNames
      .slice(localeStartOfWeek)
      .concat(weekdaysNames.slice(0, localeStartOfWeek));
  }

  get days() {
    const today = this.powerCalendar.getDate();
    const lastDay = this.lastDay();
    let day = this.firstDay();
    const days = [];
    while (isBefore(day, lastDay)) {
      days.push(this.buildDay(day, today, this.args.calendar));
      day = add(day, 1, 'day');
    }
    return days;
  }

  get weeks() {
    const { showDaysAround, days } = this;
    const weeks = [];
    let i = 0;
    while (days[i]) {
      let daysOfWeek = days.slice(i, i + 7);
      if (!showDaysAround) {
        daysOfWeek = daysOfWeek.filter((d) => d.isCurrentMonth);
      }
      weeks.push({
        id: `week-of-${daysOfWeek[0]?.id}`,
        days: daysOfWeek,
        missingDays: 7 - daysOfWeek.length,
      });
      i += 7;
    }
    return weeks;
  }

  get currentCenter() {
    let center = this.args.center;
    if (!center) {
      center = this.args.selected || this.args.calendar.center;
    }
    return normalizeDate(center);
  }

  // Actions
  @action
  handleDayFocus(e: FocusEvent) {
    scheduleOnce(
      'actions',
      this,
      this._updateFocused,
      (e.target as HTMLElement).dataset['date'],
    );
  }

  @action
  handleDayBlur() {
    scheduleOnce('actions', this, this._updateFocused, null);
  }

  @action
  handleKeyDown(e: KeyboardEvent) {
    const { focusedId } = this;
    if (focusedId) {
      const days = this.days;
      let day, index: number | undefined;
      for (let i = 0; i < days.length; i++) {
        if (days[i]?.id === focusedId) {
          index = i;
          break;
        }
      }

      if (!index) {
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex = Math.max(index - 7, 0);
        day = days[newIndex];
        if (day?.isDisabled) {
          for (let i = newIndex + 1; i <= index; i++) {
            day = days[i];
            if (!day?.isDisabled) {
              break;
            }
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIndex = Math.min(index + 7, days.length - 1);
        day = days[newIndex];
        if (day?.isDisabled) {
          for (let i = newIndex - 1; i >= index; i--) {
            day = days[i];
            if (!day?.isDisabled) {
              break;
            }
          }
        }
      } else if (e.key === 'ArrowLeft') {
        day = days[Math.max(index - 1, 0)];
        if (day?.isDisabled) {
          return;
        }
      } else if (e.key === 'ArrowRight') {
        day = days[Math.min(index + 1, days.length - 1)];
        if (day?.isDisabled) {
          return;
        }
      } else {
        return;
      }
      this.focusedId = day?.id ?? null;
      scheduleOnce('afterRender', this, this._focusDate, day?.id ?? '');
    }
  }

  // Methods
  buildDay(date: Date, today: Date, calendar: CalendarAPI): PowerCalendarDay {
    const id = formatDate(date, 'YYYY-MM-DD');

    return normalizeCalendarDay({
      id,
      number: date.getDate(),
      date: new Date(date),
      isDisabled: this.dayIsDisabled(date),
      isFocused: this.focusedId === id,
      isCurrentMonth: date.getMonth() === this.currentCenter.getMonth(),
      isToday: isSame(date, today, 'day'),
      isSelected: this.dayIsSelected(date, calendar),
    } as PowerCalendarDay);
  }

  buildonSelectValue(day: PowerCalendarDay) {
    return day;
  }

  dayIsSelected(date: Date, calendar: CalendarAPI = this.args.calendar) {
    return calendar.selected
      ? isSame(date, calendar.selected as Date, 'day')
      : false;
  }

  dayIsDisabled(date: Date) {
    const isDisabled = !this.args.calendar.actions.select;
    if (isDisabled) {
      return true;
    }

    if (
      this.args.minDate &&
      isBefore(date, startOf(this.args.minDate, 'day'))
    ) {
      return true;
    }

    if (this.args.maxDate && isAfter(date, endOf(this.args.maxDate, 'day'))) {
      return true;
    }

    if (this.args.disabledDates) {
      const disabledInRange = this.args.disabledDates.some((d) => {
        const isSameDay = isSame(date, d as Date, 'day');
        const isWeekDayIncludes =
          WEEK_DAYS.indexOf(d as string) !== -1 &&
          formatDate(date, 'ddd') === d;
        return isSameDay || isWeekDayIncludes;
      });

      if (disabledInRange) {
        return true;
      }
    }

    return false;
  }

  firstDay() {
    const firstDay = startOf(this.currentCenter, 'month');
    return startOfWeek(firstDay, this.localeStartOfWeek);
  }

  lastDay() {
    const localeStartOfWeek = this.localeStartOfWeek;
    assert(
      'The center of the calendar is an invalid date.',
      !isNaN(this.currentCenter.getTime()),
    );
    const lastDay = endOf(this.currentCenter, 'month');
    return endOfWeek(lastDay, localeStartOfWeek);
  }

  _updateFocused(id?: string | null) {
    this.focusedId = id ?? null;
  }

  _focusDate(id: string) {
    const dayElement: HTMLElement | null = document.querySelector(
      `[data-power-calendar-id="${this.args.calendar.uniqueId}"] [data-date="${id}"]`,
    );
    if (dayElement) {
      dayElement.focus();
    }
  }

  @action
  handleClick(e: MouseEvent) {
    const dayEl: HTMLElement | null | undefined = (
      e.target as HTMLElement | null
    )?.closest('[data-date]');
    if (dayEl) {
      const dateStr = dayEl.dataset['date'];
      const day = this.days.find((d) => d.id === dateStr);
      if (day) {
        if (this.args.calendar.actions.select) {
          this.args.calendar.actions.select(day, this.args.calendar, e);
        }
      }
    }
  }
}
