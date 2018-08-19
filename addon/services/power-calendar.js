import Service from '@ember/service';
import { computed } from '@ember/object';
import { getDefaultLocale } from 'ember-power-calendar-utils';

export default Service.extend({
  date: null,

  // CPs
  locale: computed(function() {
    return getDefaultLocale();
  }),

  // Methods
  getDate() {
    return this.get("date") || new Date();
  }
});
