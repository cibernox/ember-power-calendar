import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
  center: moment('2016-05-17'),
  range: {
    start: moment('2016-05-10'),
    end: moment('2016-05-15')
  }
});