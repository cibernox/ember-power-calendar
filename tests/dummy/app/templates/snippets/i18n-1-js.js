import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  calendarService: inject("power-calendar"),

  init() {
    this._super(...arguments);
    this.set("locales", ["en", "es", "ru", "fr", "pt"]);
  },

  // actions
  actions: {
    changeAppWideLocale(locale) {
      this.get("calendarService").set("locale", locale);
    }
  }
});
