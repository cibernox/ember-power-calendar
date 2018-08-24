import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
  wedding: moment('2013-10-18'),
  minDate: moment('2013-10-11'),
  maxDate: moment('2013-10-21')
});