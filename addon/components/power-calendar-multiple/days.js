import DaysComponent from '../power-calendar/days';
import fallbackIfUndefined from '../../utils/computed-fallback-if-undefined';
import { isSame } from '../../utils/date-utils';

export default DaysComponent.extend({
  maxLength: fallbackIfUndefined(Infinity),

  // Methods
  dayIsSelected(date, calendar = this.get('calendar')) {
    let selected = calendar.selected || [];
    return selected.some((d) => isSame(date, d, 'day'));
  },

  dayIsDisabled(date) {
    let numSelected = this.get('calendar.selected.length') || 0;
    let maxLength = this.get('maxLength') || Infinity;
    return this._super(...arguments) || (numSelected >= maxLength && !this.dayIsSelected(date));
  }
});
