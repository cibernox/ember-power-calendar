import Controller from 'ember-controller';
import moment from 'moment';
export default Controller.extend({
  tomorrow: null,
  tomorrowDate: null,
  pastMonth: null,
  nextMonth: null,
  februaryNextYear: null,

  // Lifecycle hooks
  init() {
    this.set('tomorrow', moment().add(1, 'day'));
    this.set('tomorrowDate', moment().add(1, 'day')._d);
    this.set('pastMonth', moment().subtract(1, 'month'));
    this.set('nextMonth', moment().add(1, 'month'));
    this.set('februaryNextYear', moment().year(2017).month('february'));
  },

  // Actions
  actions: {
    onSelect(day) {
      console.debug(day);
    }
  }
});