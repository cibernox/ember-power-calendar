import { buildTask } from 'ember-concurrency/async-arrow-runtime';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { inject } from '@ember/service';
import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import { action } from '@ember/object';
import 'ember-concurrency';
import PowerCalendarMultipleDaysComponent from './power-calendar-multiple/days.js';
import PowerCalendarNavComponent from './power-calendar/nav.js';
import { p as publicActionsObject } from '../utils-D-RRxMcK.js';
import { normalizeDate, normalizeCalendarValue, isSame, normalizeMultipleActionValue } from '../utils.js';
import { precompileTemplate } from '@ember/template-compilation';
import { g, i, n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#let (assign this.publicAPI (hash\n  Nav=(component (ensure-safe-component (or @navComponent this.navComponent)) calendar=(readonly this.publicAPI))\n  Days=(component (ensure-safe-component (or @daysComponent this.daysComponent)) calendar=(readonly this.publicAPI))\n)) as |calendar|}}\n  {{#let (element this.tagWithDefault) as |Tag|}}\n    <Tag class=\"ember-power-calendar\" ...attributes id={{calendar.uniqueId}}>\n      {{#if (has-block)}}\n        {{yield calendar}}\n      {{else}}\n        <calendar.Nav/>\n        <calendar.Days/>\n      {{/if}}\n    </Tag>\n  {{/let}}\n{{/let}}\n");

class PowerCalendarMultipleComponent extends Component {
  static {
    g(this.prototype, "powerCalendar", [inject]);
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
      return 'multiple';
    });
  }
  #_calendarType = (i(this, "_calendarType"), void 0);
  static {
    g(this.prototype, "_selected", [tracked]);
  }
  #_selected = (i(this, "_selected"), void 0);
  navComponent = PowerCalendarNavComponent;
  daysComponent = PowerCalendarMultipleDaysComponent;

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
    return publicActionsObject(this.args.onSelect, this.select, this.args.onCenterChange, this.changeCenterTask, this.currentCenter);
  }
  get selected() {
    if (this._selected) {
      return this._selected || undefined;
    }
    const value = this.args.selected;
    if (!isArray(value)) {
      return value;
    }
    const selected = [];
    for (const date of value) {
      const normalizedDate = normalizeDate(date);
      if (!(normalizedDate instanceof Date)) {
        continue;
      }
      selected.push(normalizedDate);
    }
    return selected;
  }
  set selected(v) {
    this._selected = normalizeDate(v);
  }
  get currentCenter() {
    let center = this.args.center;
    if (!center) {
      center = (this.selected || [])[0] || this.powerCalendar.getDate();
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
      actions: this.publicActions
    };
  }
  get tagWithDefault() {
    if (this.args.tag === undefined || this.args.tag === null) {
      return 'div';
    }
    return this.args.tag;
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
  select(dayOrDays, calendar, e) {
    assert(`The select action expects an array of date objects, or a date object. ${typeof dayOrDays} was recieved instead.`, isArray(dayOrDays) || dayOrDays instanceof Object && dayOrDays.date instanceof Date);
    let days;
    if (isArray(dayOrDays)) {
      days = dayOrDays;
    } else if (dayOrDays instanceof Object && dayOrDays.date instanceof Date) {
      days = [dayOrDays];
    }
    if (this.args.onSelect) {
      this.args.onSelect(this._buildCollection(days ?? []), calendar, e);
    }
  }

  // Methods
  static {
    n(this.prototype, "select", [action]);
  }
  _buildCollection(days) {
    let selected = this.selected || [];
    for (const day of days) {
      const index = selected.findIndex(selectedDate => isSame(day.date, selectedDate, 'day'));
      if (index === -1) {
        selected = [...selected, day.date];
      } else {
        selected = selected.slice(0, index).concat(selected.slice(index + 1));
      }
    }
    return normalizeMultipleActionValue({
      date: selected
    });
  }

  // Methods
  registerCalendar() {
    if (window) {
      // @ts-expect-error Property '__powerCalendars'
      window.__powerCalendars = window.__powerCalendars || {}; // TODO: weakmap??
      // @ts-expect-error Property '__powerCalendars'
      window.__powerCalendars[this.publicAPI.uniqueId] = this;
    }
  }
  unregisterCalendar() {
    // @ts-expect-error Property '__powerCalendars'
    if (window && window.__powerCalendars?.[guidFor(this)]) {
      // @ts-expect-error Property '__powerCalendars'
      delete window.__powerCalendars[guidFor(this)];
    }
  }
}
setComponentTemplate(TEMPLATE, PowerCalendarMultipleComponent);

export { PowerCalendarMultipleComponent as default };
//# sourceMappingURL=power-calendar-multiple.js.map
