import fallbackIfUndefined from '../../utils/computed-fallback-if-undefined';
import { isSame } from 'ember-power-calendar-utils';

export default {
  maxLength: fallbackIfUndefined(Infinity),

  // Methods
  isSelected(date, calendar = this.get('calendar')) {
    const selected = calendar.selected || [];
    const period = this.get('period');

    return selected.some((d) => isSame(date, d, period));
  },

  isDisabled(date) {
    const numSelected = this.get('calendar.selected.length') || 0;
    const maxLength = this.get('maxLength') || Infinity;
    
    return this._super(...arguments) || (numSelected >= maxLength && !this.isSelected(date));
  }
};
