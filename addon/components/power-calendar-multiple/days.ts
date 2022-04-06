import { isSame } from 'ember-power-calendar-utils';

import DaysComponent from '../power-calendar/days';
import { PowerCalendarMultipleAPI } from './';

interface IArgs {
  selected?: Date[];
  maxLength?: number;
}
export default class PowerCalendarMultipleDays extends DaysComponent<IArgs> {
  get maxLength(): number {
    return this.args.maxLength ?? Infinity;
  }

  // Methods
  dayIsSelected(date: Date, calendar = this.calendar as PowerCalendarMultipleAPI) {
    let selected = calendar.selected || [];
    return selected.some((d) => isSame(date, d, 'day'));
  }

  dayIsDisabled(date: Date) {
    const calendar = this.calendar as PowerCalendarMultipleAPI;
    let numSelected = (calendar.selected && calendar.selected.length) || 0;
    let maxLength = this.maxLength || Infinity;
    return super.dayIsDisabled(date) || (numSelected >= maxLength && !this.dayIsSelected(date));
  }
}
