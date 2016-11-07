import Controller from 'ember-controller';
import moment from 'moment';

export default Controller.extend({
  months: moment.months(),
  years: Array(...Array(80)).map((_, i) => `${i + 1940}`),

  actions: {
    changeCenter2(unit, calendar, val) {
      let newCenter = calendar.center.clone()[unit](val);
      calendar.actions.changeCenter(newCenter);
    }
  }
});