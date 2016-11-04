import Controller from 'ember-controller';
import moment from 'moment';

export default Controller.extend({
  months: moment.months(),
  years: Array.apply(null, Array(100)).map((_, i) => i + 1900),

  actions: {
    changeCenter(unit, calendar, e) {
      this.set
      calendar.center.clone()[unit](e.target.value);
      debugger;
    }
  }
});