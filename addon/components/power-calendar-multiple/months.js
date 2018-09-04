import MonthsComponent from '../power-calendar/months';
import fallbackIfUndefined from '../../utils/computed-fallback-if-undefined';
import { isSame } from 'ember-power-calendar-utils';

export default MonthsComponent.extend({
  maxLength: fallbackIfUndefined(Infinity),

  // Methods
  monthIsSelected(date, calendar = this.get('calendar')) {
    let selected = calendar.selected || [];
    return selected.some((m) => isSame(date, m, 'month'));
  },

  monthIsDisabled(date) {
    let numSelected = this.get('calendar.selected.length') || 0;
    let maxLength = this.get('maxLength') || Infinity;
    return this._super(...arguments) || (numSelected >= maxLength && !this.monthIsSelected(date));
  }
});
