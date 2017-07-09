import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
  center: moment('2013-10-15'),
  disabledDates: [
    moment('2013-10-18'),
    moment('2013-10-21'),
    moment('2013-10-22'),
    moment('2013-10-28')
  ]
});
