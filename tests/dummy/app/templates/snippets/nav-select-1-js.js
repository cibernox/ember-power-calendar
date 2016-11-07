import Controller from 'ember-controller';
import moment from 'moment';

export default Controller.extend({
  months: moment.months(),
  years: Array(...Array(100)).map((_, i) => `${i + 1920}`),

  actions: {
    changeCenter(unit, calendar, e) {
      let newCenter = calendar.center.clone()[unit](e.target.value);
      calendar.actions.changeCenter(newCenter);
    }
  }
});