import DaysComponent from '../power-calendar/days';
import fallbackIfUndefined from '../../utils/computed-fallback-if-undefined';

export default DaysComponent.extend({
  maxLength: fallbackIfUndefined(Infinity),

  // Methods
  dayIsSelected(dayMoment, calendar = this.get('calendar')) {
    let selected = calendar.selected || [];
    return selected.some((d) => dayMoment.isSame(d, 'day'));
  },

  dayIsDisabled(dayMoment) {
    let numSelected = this.get('calendar.selected.length') || 0;
    let maxLength = this.get('maxLength') || Infinity;
    return this._super(...arguments) || (numSelected >= maxLength && !this.dayIsSelected(dayMoment));
  }
});
