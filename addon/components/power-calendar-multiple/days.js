import DaysComponent from '../power-calendar/days';
import fallbackIfUndefined from '../../utils/computed-fallback-if-undefined';
import { isSame } from 'ember-power-calendar-utils';

export default class extends DaysComponent {
  @fallbackIfUndefined(Infinity) maxLength

  // Methods
  dayIsSelected(date, calendar = this.calendar) {
    let selected = calendar.selected || [];
    return selected.some((d) => isSame(date, d, 'day'));
  }

  dayIsDisabled(date) {
    let numSelected = (this.calendar.selected && this.calendar.selected.length) || 0;
    let maxLength = this.maxLength || Infinity;
    return super.dayIsDisabled(...arguments) || (numSelected >= maxLength && !this.dayIsSelected(date));
  }
}
