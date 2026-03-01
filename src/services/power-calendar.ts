import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { getDefaultLocale } from '../utils.ts';

export default class PowerCalendarService extends Service {
  date: Date | null = null;

  @tracked _local?: string;

  get locale(): string {
    if (this._local) {
      return this._local;
    }

    return getDefaultLocale();
  }

  set locale(value) {
    this._local = value;
  }

  // Methods
  getDate(): Date {
    return this.date || new Date();
  }
}
