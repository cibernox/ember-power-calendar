import Controller from '@ember/controller';
import { add } from 'ember-power-select/utils/date-utils';

export default Controller.extend({
  tomorrow: null,
  tomorrowDate: null,
  pastMonth: null,
  nextMonth: null,
  februaryNextYear: null,
  range: null,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.set('tenDaysAgo', add(new Date(), -10, 'day'));
    this.set('threeDaysAgo', add(new Date(), -3, 'day'));
    this.set('threeDaysFromNow', add(new Date(), 3, 'day'));
    this.set('tomorrow', add(new Date(), 1, 'day'));
    this.set('tomorrowDate', add(new Date(), 1, 'day').toDate());
    this.set('pastMonth', add(new Date(), -1, 'month'));
    this.set('nextMonth', add(new Date(), 1, 'month'));
    this.set('februaryNextYear', new Date(2017, 1, 5));
    this.set('selected', add(new Date(), -15, 'day'));
    this.set('range', { start: add(new Date(), 2, 'day'), end: add(new Date(), 7, 'day') });
  }
});
