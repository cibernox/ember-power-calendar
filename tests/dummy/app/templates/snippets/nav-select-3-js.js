import Controller from 'ember-controller';
import moment from 'moment';

export default Controller.extend({
  months: moment.months(),

  actions: {
    changeYear(calendar, e) {
      let newCenter = calendar.center.clone().year(e.target.value);
      calendar.actions.changeCenter(newCenter);
    }
  }
});