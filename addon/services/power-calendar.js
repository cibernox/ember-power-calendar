import Ember from 'ember';
import { guidFor } from 'ember-metal/utils';

export default Ember.Service.extend({
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
