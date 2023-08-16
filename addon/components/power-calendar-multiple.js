import CalendarComponent from './power-calendar';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  normalizeDate,
  isSame,
  normalizeMultipleActionValue,
} from 'ember-power-calendar-utils';
import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import PowerCalendarMultipleDaysComponent from './power-calendar-multiple/days';

export default class extends CalendarComponent {
  daysComponent = PowerCalendarMultipleDaysComponent;
  _calendarType = 'multiple';

  @tracked _selected;

  get selected() {
    if (this._selected) {
      return this._selected;
    }

    const value = this.args.selected;

    return isArray(value) ? value.map(normalizeDate) : value;
  }

  get currentCenter() {
    let center = this.args.center;
    if (!center) {
      center = (this.selected || [])[0] || this.powerCalendarService.getDate();
    }
    return normalizeDate(center);
  }

  // Actions
  @action
  select(dayOrDays, calendar, e) {
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
      this.args.onSelect(this._buildCollection(days), calendar, e);
    }
  }

  // Methods
  _buildCollection(days) {
    let selected = this.publicAPI.selected || [];

    for (let day of days) {
      let index = selected.findIndex((selectedDate) =>
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
}
