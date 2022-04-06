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
  withLocale
} from 'ember-power-calendar-utils';

import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { CalendarAPI, PowerCalendarDay } from '../';

import type PowerCalendarService from '../../../services/power-calendar';
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface IArgs {
  calendar: CalendarAPI;
  maxLength?: number;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Array<Date | string>;
  weekdayFormat?: 'min' | 'short' | 'long';
  startOfWeek?: string;
  center?: Date;
  selected?: Date;
  showDaysAround?: boolean;
  dayClass?: string;
}

export default class PowerCalendarDays<T = {}> extends Component<T & IArgs> {
  @service declare powerCalendar: PowerCalendarService;

  @tracked focusedId: string | null = null;

  get showDaysAround() {
    return this.args.showDaysAround ?? true;
  }
  get weekdayFormat() {
    return this.args.weekdayFormat ?? 'short';
  }

  // CPs
  get calendar(): CalendarAPI {
    return this.args.calendar;
  }
  @computed('calendar.locale')
  get weekdaysMin() {
    return withLocale(this.calendar.locale, getWeekdaysMin);
  }

  @computed('calendar.locale')
  get weekdaysShort() {
    return withLocale(this.calendar.locale, getWeekdaysShort);
  }

  @computed('calendar.locale')
  get weekdays() {
    return withLocale(this.calendar.locale, getWeekdays);
  }

  get localeStartOfWeek() {
    const forcedStartOfWeek = this.args.startOfWeek;
    if (forcedStartOfWeek) {
      return parseInt(forcedStartOfWeek, 10);
    }

    return localeStartOfWeek(this.calendar.locale);
  }

  get weekdaysNames() {
    const { localeStartOfWeek, weekdayFormat } = this;
    const format: keyof PowerCalendarDays = `weekdays${
      weekdayFormat === 'long' ? '' : weekdayFormat === 'min' ? 'Min' : 'Short'
    }`;
    const weekdaysNames = this[format];

    return weekdaysNames.slice(localeStartOfWeek).concat(weekdaysNames.slice(0, localeStartOfWeek));
  }

  get days() {
    const today = this.powerCalendar.getDate();
    const lastDay = this.lastDay();
    let day = this.firstDay();
    const days = [];
    while (isBefore(day, lastDay)) {
      days.push(this.buildDay(day, today, this.calendar));
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
        id: `week-of-${daysOfWeek[0].id}`,
        days: daysOfWeek,
        missingDays: 7 - daysOfWeek.length
      });
      i += 7;
    }
    return weeks;
  }

  get currentCenter() {
    let center = this.args.center;

    if (!center) {
      center = this.args.selected || this.calendar.center;
    }
    return normalizeDate(center);
  }

  // Actions
  @action
  handleClick(e: MouseEvent) {
    const dayEl: HTMLElement | null | undefined = (e.target as HTMLElement | null)?.closest(
      '[data-date]'
    );

    if (dayEl) {
      let dateStr = dayEl.dataset.date;
      let day = this.days.find((d) => d.id === dateStr);
      if (day) {
        if (this.calendar.actions.select) {
          this.calendar.actions.select(day, this.calendar, e);
        }
      }
    }
  }

  @action
  handleDayFocus(e: FocusEvent) {
    scheduleOnce(
      'actions',
      this,
      this._updateFocused,
      (e.target as HTMLElement | null)?.dataset.date
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
      let days = this.days;
      let day, index: number;
      for (let i = 0; i < days.length; i++) {
        if (days[i].id === focusedId) {
          index = i;
          break;
        }
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        let newIndex = Math.max(index! - 7, 0);
        day = days[newIndex];
        if (day.isDisabled) {
          for (let i = newIndex + 1; i <= index!; i++) {
            day = days[i];
            if (!day.isDisabled) {
              break;
            }
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        let newIndex = Math.min(index! + 7, days.length - 1);
        day = days[newIndex];
        if (day.isDisabled) {
          for (let i = newIndex - 1; i >= index!; i--) {
            day = days[i];
            if (!day.isDisabled) {
              break;
            }
          }
        }
      } else if (e.key === 'ArrowLeft') {
        day = days[Math.max(index! - 1, 0)];
        if (day.isDisabled) {
          return;
        }
      } else if (e.key === 'ArrowRight') {
        day = days[Math.min(index! + 1, days.length - 1)];
        if (day.isDisabled) {
          return;
        }
      } else {
        return;
      }

      this.focusedId = day.id;
      scheduleOnce('afterRender', this, this._focusDate, day.id);
    }
  }

  // Methods
  dayIsSelected(date: Date, calendar: CalendarAPI = this.calendar) {
    const { selected } = calendar;
    return selected ? isSame(date, selected, 'day') : false;
  }

  dayIsDisabled(date: Date) {
    const isDisabled = !this.calendar.actions.select;
    const { minDate, maxDate, disabledDates } = this.args;

    if (isDisabled) {
      return true;
    }

    if (minDate && isBefore(date, startOf(minDate, 'day'))) {
      return true;
    }

    if (maxDate && isAfter(date, endOf(maxDate, 'day'))) {
      return true;
    }

    if (disabledDates) {
      const disabledInRange = disabledDates.some((d) => {
        const isSameDay = isSame(date, d, 'day');
        const isWeekDayIncludes =
          WEEK_DAYS.indexOf(d as string) !== -1 && formatDate(date, 'ddd') === d;
        return isSameDay || isWeekDayIncludes;
      });

      if (disabledInRange) {
        return true;
      }
    }

    return false;
  }

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
      isSelected: this.dayIsSelected(date, calendar)
    });
  }

  buildonSelectValue(day: PowerCalendarDay) {
    return day;
  }

  firstDay() {
    let firstDay = startOf(this.currentCenter, 'month');
    return startOfWeek(firstDay, this.localeStartOfWeek);
  }

  lastDay() {
    let localeStartOfWeek = this.localeStartOfWeek;
    assert('The center of the calendar is an invalid date.', !isNaN(this.currentCenter.getTime()));
    let lastDay = endOf(this.currentCenter, 'month');
    return endOfWeek(lastDay, localeStartOfWeek);
  }

  _updateFocused(id?: string | null) {
    this.focusedId = id ?? null;
  }

  _focusDate(id: string) {
    let dayElement: HTMLElement | null = document.querySelector(
      `[data-power-calendar-id="${this.calendar.uniqueId}"] [data-date="${id}"]`
    );
    if (dayElement) {
      dayElement.focus();
    }
  }
}
