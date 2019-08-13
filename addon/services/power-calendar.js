import Service from '@ember/service';
import { computed } from '@ember/object';
import { getDefaultLocale } from 'ember-power-calendar-utils';

export default class extends Service {
  date = null

  // CPs
  @computed
  get locale() {
    return getDefaultLocale();
  }
  set locale(value) {
    return value;
  }

  // Methods
  getDate() {
    return this.date || new Date();
  }
}
