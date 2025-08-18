import { buildTask } from 'ember-concurrency/async-arrow-runtime';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { s as service, D as DAY_IN_MS$1 } from '../days-utils-DYG5o-Ye.js';
import { guidFor } from '@ember/object/internals';
import { assert } from '@ember/debug';
import PowerCalendarRangeDaysComponent from './power-calendar-range/days.js';
import PowerCalendarNavComponent from './power-calendar/nav.js';
import { p as publicActionsObject } from '../utils-y7Wx9c84.js';
import { normalizeDate, normalizeCalendarValue, diff, normalizeDuration, normalizeRangeActionValue, isBefore, isAfter } from '../utils.js';
import { precompileTemplate } from '@ember/template-compilation';
import { g, i, n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#let\n  (assign\n    this.publicAPI\n    (hash\n      Nav=(component\n        (ensure-safe-component (or @navComponent this.navComponent))\n        calendar=(readonly this.publicAPI)\n        isDatePicker=@isDatePicker\n      )\n      Days=(component\n        (ensure-safe-component (or @daysComponent this.daysComponent))\n        calendar=(readonly this.publicAPI)\n        isDatePicker=@isDatePicker\n        autofocus=@autofocus\n      )\n    )\n  )\n  as |calendar|\n}}\n  {{#let (element this.tagWithDefault) as |Tag|}}\n    <Tag\n      class=\"ember-power-calendar\"\n      role={{if @isDatePicker \"dialog\" \"group\"}}\n      aria-modal={{if @isDatePicker \"true\"}}\n      aria-label={{if\n        @ariaLabel\n        @ariaLabel\n        (unless @ariaLabeledBy \"Choose Date Range\")\n      }}\n      aria-labelledby={{@ariaLabeledBy}}\n      ...attributes\n      id={{calendar.uniqueId}}\n    >\n      {{#if (has-block)}}\n        {{yield calendar}}\n      {{else}}\n        <calendar.Nav />\n        <calendar.Days />\n      {{/if}}\n    </Tag>\n  {{/let}}\n{{/let}}");

const DAY_IN_MS = DAY_IN_MS$1;
class PowerCalendarRangeComponent extends Component {
  static {
    g(this.prototype, "powerCalendar", [service]);
  }
  #powerCalendar = (i(this, "powerCalendar"), void 0);
  static {
    g(this.prototype, "center", [tracked], function () {
      return null;
    });
  }
  #center = (i(this, "center"), void 0);
  static {
    g(this.prototype, "_calendarType", [tracked], function () {
      return 'range';
    });
  }
  #_calendarType = (i(this, "_calendarType"), void 0);
  static {
    g(this.prototype, "_selected", [tracked]);
  }
  #_selected = (i(this, "_selected"), void 0);
  navComponent = PowerCalendarNavComponent;
  daysComponent = PowerCalendarRangeDaysComponent;

  // Lifecycle hooks
  constructor(owner, args) {
    super(owner, args);
    this.registerCalendar();
    if (this.args.onInit) {
      this.args.onInit(this.publicAPI);
    }
  }
  willDestroy() {
    super.willDestroy();
    this.unregisterCalendar();
  }
  get publicActions() {
    return publicActionsObject(this.args.onSelect, this.select.bind(this), this.args.onCenterChange, this.changeCenterTask, this.currentCenter);
  }
  get selected() {
    if (this._selected) {
      return this._selected;
    }
    if (this.args.selected) {
      return {
        start: normalizeDate(this.args.selected.start),
        end: normalizeDate(this.args.selected.end)
      };
    }
    return {
      start: undefined,
      end: undefined
    };
  }
  set selected(v) {
    if (v === undefined || v === null) {
      v = {};
    }
    this._selected = {
      start: normalizeDate(v.start),
      end: normalizeDate(v.end)
    };
  }
  get currentCenter() {
    let center = this.args.center;
    if (!center) {
      center = this.selected.start || this.powerCalendar.getDate();
    }
    return normalizeDate(center) || this.powerCalendar.getDate();
  }
  get publicAPI() {
    return {
      uniqueId: guidFor(this),
      type: this._calendarType,
      selected: this.selected,
      loading: this.changeCenterTask.isRunning,
      center: this.currentCenter,
      locale: this.args.locale || this.powerCalendar.locale,
      actions: this.publicActions,
      minRange: this.minRange,
      maxRange: this.maxRange
    };
  }
  get tagWithDefault() {
    if (this.args.tag === undefined || this.args.tag === null) {
      return 'div';
    }
    return this.args.tag;
  }
  get proximitySelection() {
    return this.args.proximitySelection !== undefined ? this.args.proximitySelection : false;
  }
  get minRange() {
    if (this.args.minRange !== undefined) {
      return this._formatRange(this.args.minRange);
    }
    return DAY_IN_MS;
  }
  get maxRange() {
    if (this.args.maxRange !== undefined) {
      return this._formatRange(this.args.maxRange);
    }
    return null;
  }

  // Tasks
  changeCenterTask = buildTask(() => ({
    context: this,
    generator: function* (newCenter, calendar, e) {
      assert("You attempted to move the center of a calendar that doesn't receive an `@onCenterChange` action.", typeof this.args.onCenterChange === 'function');
      const value = normalizeCalendarValue({
        date: newCenter
      });
      yield this.args.onCenterChange(value, calendar, e);
    }
  }), null, "changeCenterTask", null);

  // Actions
  select(day, calendar, e) {
    const {
      date
    } = day;
    assert('date must be either a Date, or a Range', date && (ownProp(date, 'start') || ownProp(date, 'end') || date instanceof Date));
    let range;
    if (ownProp(date, 'start') && ownProp(date, 'end')) {
      range = {
        date
      };
    } else {
      range = this._buildRange({
        date
      });
    }
    const {
      start,
      end
    } = range.date;
    if (start && end) {
      const {
        minRange,
        maxRange
      } = this.publicAPI;
      const diffInMs = Math.abs(diff(end, start));
      if (diffInMs < (minRange ?? DAY_IN_MS) || maxRange && diffInMs > maxRange) {
        return;
      }
    }
    if (this.args.onSelect) {
      this.args.onSelect(range, calendar, e);
    }
  }
  static {
    n(this.prototype, "select", [action]);
  }
  _formatRange(v) {
    if (typeof v === 'number') {
      return v * DAY_IN_MS;
    }
    return normalizeDuration(v === undefined ? DAY_IN_MS : v);
  }

  // Methods
  _buildRange(day) {
    const selected = this.selected || {
      start: null,
      end: null
    };
    const {
      start,
      end
    } = selected;
    if (this.proximitySelection) {
      return this._buildRangeByProximity(day, start, end);
    }
    return this._buildDefaultRange(day, start, end);
  }
  _buildRangeByProximity(day, start, end) {
    if (start && end) {
      const changeStart = Math.abs(diff(day.date, end)) > Math.abs(diff(day.date, start));
      return normalizeRangeActionValue({
        date: {
          start: changeStart ? day.date : start,
          end: changeStart ? end : day.date
        }
      });
    }
    if (start && isBefore(day.date, start)) {
      return normalizeRangeActionValue({
        date: {
          start: day.date,
          end: null
        }
      });
    }
    return this._buildDefaultRange(day, start, end);
  }
  _buildDefaultRange(day, start, end) {
    if (start && !end) {
      if (isAfter(start, day.date)) {
        return normalizeRangeActionValue({
          date: {
            start: day.date,
            end: start
          }
        });
      }
      return normalizeRangeActionValue({
        date: {
          start: start,
          end: day.date
        }
      });
    }
    return normalizeRangeActionValue({
      date: {
        start: day.date,
        end: null
      }
    });
  }

  // Methods
  registerCalendar() {
    if (window) {
      // @ts-expect-error Property '__powerCalendars'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      window.__powerCalendars = window.__powerCalendars || {}; // TODO: weakmap??
      // @ts-expect-error Property '__powerCalendars'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      window.__powerCalendars[this.publicAPI.uniqueId] = this;
    }
  }
  unregisterCalendar() {
    // @ts-expect-error Property '__powerCalendars'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (window && window.__powerCalendars?.[guidFor(this)]) {
      // @ts-expect-error Property '__powerCalendars'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      delete window.__powerCalendars[guidFor(this)];

      // @ts-expect-error Property '__powerCalendars'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (Object.keys(window.__powerCalendars).length === 0) {
        // @ts-expect-error Property '__powerCalendars'
        delete window.__powerCalendars;
      }
    }
  }
}
function ownProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
setComponentTemplate(TEMPLATE, PowerCalendarRangeComponent);

export { DAY_IN_MS, PowerCalendarRangeComponent as default };
//# sourceMappingURL=power-calendar-range.js.map
