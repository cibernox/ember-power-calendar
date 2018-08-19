import Controller from '@ember/controller';
import { add } from 'ember-power-calendar-utils';

export default Controller.extend({
  tomorrow: null,
  pastMonth: null,
  nextMonth: null,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.set('tomorrow', add(new Date(), 1, 'day'));
    this.set('pastMonth', add(new Date(), -1, 'month'));
    this.set('nextMonth', add(new Date(), 1, 'month'));
    this.set('selected', add(new Date(), 1, 'day'));
  }
});
