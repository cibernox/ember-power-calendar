import DaysComponent, { type PowerCalendarDaysArgs, type PowerCalendarDaysSignature } from '../power-calendar/days.ts';
import { isSame } from '../../utils.ts';
import type { PowerCalendarMultipleAPI } from '../power-calendar-multiple.ts';

interface PowerCalendarMultipleDaysArgs extends Omit<PowerCalendarDaysArgs, 'selected'>  {
  selected?: Date[];
  maxLength?: number;
}

interface PowerCalendarMultipleDaysSignature extends Omit<PowerCalendarDaysSignature, 'Args'> {
  Args: PowerCalendarMultipleDaysArgs
}

export default class PowerCalendarMultipleDaysComponent extends DaysComponent<PowerCalendarMultipleDaysSignature> {
  get maxLength(): number {
    return this.args.maxLength || Infinity;
  }

  // Methods
  dayIsSelected(date: Date, calendar = this.args.calendar as PowerCalendarMultipleAPI) {
    let selected = calendar.selected || [];
    return selected.some((d) => isSame(date, d, 'day'));
  }

  dayIsDisabled(date: Date) {
    const calendar = this.args.calendar as PowerCalendarMultipleAPI;
    let numSelected = (calendar.selected && calendar.selected.length) || 0;
    let maxLength = this.maxLength || Infinity;
    return (
      super.dayIsDisabled(date) ||
      (numSelected >= maxLength && !this.dayIsSelected(date))
    );
  }
}
