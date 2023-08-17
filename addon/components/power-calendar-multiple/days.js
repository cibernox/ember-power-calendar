import DaysComponent from '../power-calendar/days';
import { isSame } from 'ember-power-calendar/utils';

export default class extends DaysComponent {
  get maxLength() {
    return this.args.maxLength || Infinity;
  }

  // Methods
  dayIsSelected(date, calendar = this.args.calendar) {
    let selected = calendar.selected || [];
    return selected.some((d) => isSame(date, d, 'day'));
  }

  dayIsDisabled(date) {
    let numSelected =
      (this.args.calendar.selected && this.args.calendar.selected.length) || 0;
    let maxLength = this.maxLength || Infinity;
    return (
      super.dayIsDisabled(...arguments) ||
      (numSelected >= maxLength && !this.dayIsSelected(date))
    );
  }
}
