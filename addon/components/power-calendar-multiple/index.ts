import {
  isSame,
  normalizeDate,
  normalizeMultipleActionValue
} from 'ember-power-calendar-utils';

import { isArray } from '@ember/array';
import { assert } from '@ember/debug';
import { action } from '@ember/object';

import PowerCalendarComponent, {
  CalendarDay,
  PowerCalendarAPI,
  PowerCalendarArgs,
  PowerCalendarDay,
  TCalendarType
} from '../power-calendar';

export interface PowerCalendarMultipleAPI extends Omit<PowerCalendarAPI, 'selected'> {
  selected?: Date[];
}

export interface PowerCalendarMultipleArgs extends Omit<PowerCalendarArgs, 'selected'> {
  selected?: Date[];
}

export default class PowerCalendarMultiple extends PowerCalendarComponent<PowerCalendarMultipleArgs> {
  daysComponent = 'power-calendar-multiple/days';
  _calendarType: TCalendarType = 'multiple';

  // CPs
  get selected(): Date[] | undefined {
    const { selected } = this.args;
    return isArray(selected) ? selected.map(normalizeDate) : selected;
  }

  get currentCenter() {
    let center = this.args.center;
    if (!center) {
      center = (this.selected || [])[0] || this.powerCalendar.getDate();
    }
    return normalizeDate(center);
  }

  // Actions
  @action
  select(dayOrDays: CalendarDay, calendar: PowerCalendarAPI, e: MouseEvent) {
    assert(
      `The select action expects an array of date objects, or a date object. ${typeof dayOrDays} was recieved instead.`,
      isArray(dayOrDays) || (dayOrDays instanceof Object && dayOrDays.date instanceof Date)
    );

    let days;

    if (isArray(dayOrDays)) {
      days = dayOrDays;
    } else if (dayOrDays instanceof Object && dayOrDays.date instanceof Date) {
      days = [dayOrDays];
    }

    if (this.args.onSelect) {
      this.args.onSelect(this._buildCollection((days as PowerCalendarDay[]) ?? []), calendar, e);
    }
  }

  // Methods
  _buildCollection(days: PowerCalendarDay[]) {
    let selected: Date[] = (this.publicAPI.selected as Date[] | undefined) || [];

    for (let day of days) {
      let index = selected.findIndex((selectedDate: Date) => isSame(day.date, selectedDate, 'day'));
      if (index === -1) {
        selected = [...selected, day.date];
      } else {
        selected = selected.slice(0, index).concat(selected.slice(index + 1));
      }
    }

    return normalizeMultipleActionValue({ date: selected });
  }
}
