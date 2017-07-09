import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
  today: null,

  init() {
    this._super(...arguments);
    this.set('today', moment());
  }
});