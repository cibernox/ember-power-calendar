import CalendarComponent from './power-calendar';
import { computed, action } from '@ember/object';
import {
  normalizeDate,
  isSame,
  normalizeMultipleActionValue
} from 'ember-power-calendar-utils';
import { assert } from '@ember/debug';
import { isArray } from '@ember/array';

export default class extends CalendarComponent {
  daysComponent = 'power-calendar-multiple/days'
  _calendarType = 'multiple'

  // CPs
  @computed
  get selected() {
    return undefined;
  }
  set selected(v) {
    return isArray(v) ? v.map(normalizeDate) : v;
  }

  @computed('center')
  get currentCenter() {
    let center = this.center;
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
      isArray(dayOrDays) || dayOrDays instanceof Object && dayOrDays.date instanceof Date
    );

    let days;

    if (isArray(dayOrDays)) {
      days = dayOrDays;
    } else if (dayOrDays instanceof Object && dayOrDays.date instanceof Date) {
      days = [dayOrDays];
    }

    if (this.onSelect) {
      this.onSelect(this._buildCollection(days), calendar, e);
    }
  }

  // Methods
  _buildCollection(days) {
    let selected = this.publicAPI.selected || [];

    for (let day of days) {
      let index = selected.findIndex(selectedDate => isSame(day.date, selectedDate, "day"));
      if (index === -1) {
        selected = [...selected, day.date];
      } else {
        selected = selected.slice(0, index).concat(selected.slice(index + 1));
      }
    }

    return normalizeMultipleActionValue({ date: selected });
  }
}
