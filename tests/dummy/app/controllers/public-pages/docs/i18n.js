import Controller from '@ember/controller';
// import { inject } from '@ember/service';

export default Controller.extend({
  // moment: inject(),

  init() {
    this._super(...arguments);
    // this.set('locales', moment.locales());
  },

  // actions
  actions: {
    changeAppWideLocale(locale) {
      // this.get('moment').changeLocale(locale);
    }
  }
});
