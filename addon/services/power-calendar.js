import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { getDefaultLocale } from 'ember-power-calendar/utils';

export default class extends Service {
  date = null;

  @tracked _local;

  get locale() {
    if (this._local) {
      return this._local;
    }

    return getDefaultLocale();
  }

  set locale(value) {
    this._local = value;
  }

  // Methods
  getDate() {
    return this.date || new Date();
  }
}
