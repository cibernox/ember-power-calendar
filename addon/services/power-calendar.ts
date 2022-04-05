import { getDefaultLocale } from 'ember-power-calendar-utils';

import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PowerCalendarService extends Service {
  date = null;

  @tracked locale = getDefaultLocale();

  // Methods
  getDate() {
    return this.date || new Date();
  }
}
