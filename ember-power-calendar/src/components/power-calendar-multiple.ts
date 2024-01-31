import PowerCalendarComponent, {
  type CalendarDay,
  type PowerCalendarAPI,
  type PowerCalendarArgs,
  type PowerCalendarDay,
  type PowerCalendarSignature,
  type TCalendarType
} from './power-calendar.ts';
import { action } from '@ember/object';
import { normalizeDate, isSame, normalizeMultipleActionValue } from '../utils.ts';
import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import PowerCalendarMultipleDaysComponent from './power-calendar-multiple/days.ts';

export interface PowerCalendarMultipleAPI extends Omit<PowerCalendarAPI, 'selected'> {
  selected?: Date[];
}

interface PowerCalendarMultipleArgs extends Omit<PowerCalendarArgs, 'selected' | 'onSelect'> {
  selected?: Date[];
  onSelect?: (
    day: PowerCalendarDay[],
    calendar: PowerCalendarMultipleAPI,
    event: MouseEvent
  ) => void;
}

interface PowerCalendarMultipleSignature extends Omit<PowerCalendarSignature, 'Args'> {
  Args: PowerCalendarMultipleArgs;
}

export default class PowerCalendarMultipleComponent extends PowerCalendarComponent<PowerCalendarMultipleSignature> {
  daysComponent = PowerCalendarMultipleDaysComponent;
  _calendarType: TCalendarType = 'multiple';

  get selected(): Date[] | undefined {
    if (this._selected) {
      return this._selected as Date[] || undefined;
    }

    const value = this.args.selected;

    return isArray(value) ? value.map(normalizeDate) : value;
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
  select(dayOrDays: CalendarDay, calendar: PowerCalendarMultipleAPI, e: MouseEvent) {
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
      this.args.onSelect(this._buildCollection((days as PowerCalendarDay[]) ?? []), calendar, e);
    }
  }

  // Methods
  _buildCollection(days: PowerCalendarDay[]) {
    let selected = this.selected || [];

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
