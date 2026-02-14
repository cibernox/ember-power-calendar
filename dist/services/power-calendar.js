import s__default from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { getDefaultLocale } from '../utils.js';
import { g, i } from 'decorator-transforms/runtime';

class PowerCalendarService extends s__default {
  date = null;
  static {
    g(this.prototype, "_local", [tracked]);
  }
  #_local = (i(this, "_local"), void 0);
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

export { PowerCalendarService as default };
//# sourceMappingURL=power-calendar.js.map
