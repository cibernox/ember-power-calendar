import Controller from 'ember-controller';
import moment from 'moment';
export default Controller.extend({
  tomorrow: null,
  tomorrowDate: null,
  pastMonth: null,
  nextMonth: null,
  februaryNextYear: null,
  range: null,

  // Lifecycle hooks
  init() {
    this.set('tenDaysAgo', moment().add(-10, 'day'));
    this.set('threeDaysAgo', moment().add(-3, 'day'));
    this.set('tomorrow', moment().add(1, 'day'));
    this.set('tomorrowDate', moment().add(1, 'day')._d);
    this.set('pastMonth', moment().subtract(1, 'month'));
    this.set('nextMonth', moment().add(1, 'month'));
    this.set('februaryNextYear', moment().year(2017).month('february'));
    this.set('selected', moment().add(1, 'day'));
    this.set('range', { start: moment().add(2, 'day'), end: moment().add(7, 'day') });
  }
});