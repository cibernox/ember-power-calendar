import Service from '@ember/service';
import { guidFor } from '@ember/object/internals';

export default Service.extend({
  date: null,

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    this._calendars = {};
  },

  // Methods
  getDate() {
    return this.get('date') || new Date();
  },

  registerCalendar(calendar) {
    this._calendars[guidFor(calendar)] = calendar;
  },

  unregisterCalendar(calendar) {
    delete this._calendars[guidFor(calendar)];
  }
});
