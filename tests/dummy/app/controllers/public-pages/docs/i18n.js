import Controller from 'ember-controller';
import service from 'ember-service/inject';
import moment from 'moment';

export default Controller.extend({
  moment: service(),

  init() {
    this._super(...arguments);
    this.set('locales', moment.locales());
  },

  // actions
  actions: {
    changeAppWideLocale(locale) {
      this.get('moment').changeLocale(locale);
    }
  }
});