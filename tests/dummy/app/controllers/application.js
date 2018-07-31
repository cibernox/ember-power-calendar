import Controller from '@ember/controller';
import { add } from 'ember-power-calendar/utils/date-utils';
import moment from 'moment';
import es from 'moment/locale/es'; // eslint-disable-line
import ru from 'moment/locale/ru'; // eslint-disable-line
import fr from 'moment/locale/fr'; // eslint-disable-line
import pt from 'moment/locale/pt'; // eslint-disable-line
moment.locale('en');

export default Controller.extend({
  tomorrow: null,
  pastMonth: null,
  nextMonth: null,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this.set('tomorrow', add(new Date(), 1, 'day'));
    this.set('pastMonth', add(new Date(), -1, 'month'));
    this.set('nextMonth', add(new Date(), 1, 'month'));
    this.set('selected', add(new Date(), 1, 'day'));
  }
});
