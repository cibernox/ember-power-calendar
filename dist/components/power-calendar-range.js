import { buildTask } from 'ember-concurrency/async-arrow-runtime';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { s as service, D as DAY_IN_MS$1 } from '../days-utils-DYG5o-Ye.js';
import { guidFor } from '@ember/object/internals';
import { assert } from '@ember/debug';
import PowerCalendarRangeDays from './power-calendar-range/days.js';
import PowerCalendarRangeNav from './power-calendar-range/nav.js';
import { add, normalizeDate, normalizeCalendarValue, diff, normalizeDuration, normalizeRangeActionValue, isBefore, isAfter } from '../utils.js';
import { element } from 'ember-element-helper';
import { hash } from '@ember/helper';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { g, i, n } from 'decorator-transforms/runtime';

const DAY_IN_MS = DAY_IN_MS$1;
class PowerCalendarRange extends Component {
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
    g(this.prototype, "_selected", [tracked]);
  }
  #_selected = (i(this, "_selected"), void 0);
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
    const onSelect = this.args.onSelect;
    const select = this.select.bind(this);
    const onCenterChange = this.args.onCenterChange;
    const changeCenterTask = this.changeCenterTask;
    const currentCenter = this.currentCenter;
    const actions = {};
    if (onSelect) {
      actions.select = (...args) => select(...args);
    }
    if (onCenterChange) {
      const changeCenter = (newCenter, calendar, e) => {
        return changeCenterTask.perform(newCenter, calendar, e);
      };
      actions.changeCenter = changeCenter;
      actions.moveCenter = async (step, unit, calendar, e) => {
        const newCenter = add(currentCenter, step, unit);
        return await changeCenter(newCenter, calendar, e);
      };
    }
    return actions;
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
      type: 'range',
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
  get navComponent() {
    return this.args.navComponent || PowerCalendarRangeNav;
  }
  get daysComponent() {
    return this.args.daysComponent || PowerCalendarRangeDays;
  }
  calendarAPI(publicAPI, components) {
    return Object.assign({}, publicAPI, components);
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
    assert('date must be either a Date, or a Range', date && ('start' in date || 'end' in date || date instanceof Date));
    let range;
    if ('start' in date && 'end' in date) {
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
  static {
    setComponentTemplate(precompileTemplate("\n    {{#let (this.calendarAPI this.publicAPI (hash Nav=(component this.navComponent calendar=this.publicAPI isDatePicker=@isDatePicker) Days=(component this.daysComponent calendar=this.publicAPI isDatePicker=@isDatePicker autofocus=@autofocus))) as |calendar|}}\n      {{#let (element this.tagWithDefault) as |Tag|}}\n        <Tag class=\"ember-power-calendar\" role={{if @isDatePicker \"dialog\" \"group\"}} aria-modal={{if @isDatePicker \"true\"}} aria-label={{if @ariaLabel @ariaLabel (unless @ariaLabeledBy \"Choose Date Range\")}} aria-labelledby={{@ariaLabeledBy}} ...attributes id={{calendar.uniqueId}}>\n          {{#if (has-block)}}\n            {{yield calendar}}\n          {{else}}\n            <calendar.Nav />\n            <calendar.Days />\n          {{/if}}\n        </Tag>\n      {{/let}}\n    {{/let}}\n  ", {
      strictMode: true,
      scope: () => ({
        hash,
        element
      })
    }), this);
  }
}

export { DAY_IN_MS, PowerCalendarRange as default };
//# sourceMappingURL=power-calendar-range.js.map
