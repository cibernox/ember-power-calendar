import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { assert } from '@ember/debug';
import {
  add,
  normalizeDate,
  normalizeCalendarValue,
} from 'ember-power-calendar/utils';
import PowerCalendarNavComponent from './power-calendar/nav';
import PowerCalendarDaysComponent from './power-calendar/days';

export default class extends Component {
  @service('power-calendar') powerCalendarService;

  @tracked center = null;
  @tracked _calendarType = 'single';
  @tracked _selected;

  navComponent = PowerCalendarNavComponent;
  daysComponent = PowerCalendarDaysComponent;

  // Lifecycle hooks
  constructor() {
    super(...arguments);
    this.registerCalendar();
    if (this.args.onInit) {
      this.args.onInit(this.publicAPI);
    }
  }

  get publicActions() {
    let actions = {};
    if (this.args.onSelect) {
      actions.select = (...args) => this.select(...args);
    }
    if (this.args.onCenterChange) {
      let changeCenter = (newCenter, calendar, e) => {
        return this.changeCenterTask.perform(newCenter, calendar, e);
      };
      actions.changeCenter = changeCenter;
      actions.moveCenter = (step, unit, calendar, e) => {
        let newCenter = add(this.currentCenter, step, unit);
        return changeCenter(newCenter, calendar, e);
      };
    }
    return actions;
  }

  get selected() {
    if (this._selected) {
      return this._selected;
    }

    return normalizeDate(this.args.selected);
  }

  set selected(v) {
    this._selected = normalizeDate(v);
  }

  get currentCenter() {
    let center = this.args.center;
    if (!center) {
      center = this.selected || this.powerCalendarService.getDate();
    }
    return normalizeDate(center);
  }

  get publicAPI() {
    return this._publicAPI;
  }

  get _publicAPI() {
    return {
      uniqueId: guidFor(this),
      type: this._calendarType,
      selected: this.selected,
      loading: this.changeCenterTask.isRunning,
      center: this.currentCenter,
      locale: this.args.locale || this.powerCalendarService.locale,
      actions: this.publicActions,
    };
  }

  get tagWithDefault() {
    if (this.args.tag === undefined || this.args.tag === null) {
      return 'div';
    }
    return this.args.tag;
  }

  // Actions
  @action
  select(day, calendar, e) {
    if (this.args.onSelect) {
      this.args.onSelect(day, calendar, e);
    }
  }

  @action
  destroyElement() {
    this.unregisterCalendar();
  }

  // Tasks
  @task(function* (newCenter, calendar, e) {
    assert(
      "You attempted to move the center of a calendar that doesn't receive an `@onCenterChange` action.",
      typeof this.args.onCenterChange === 'function',
    );
    let value = normalizeCalendarValue({ date: newCenter });
    yield this.args.onCenterChange(value, calendar, e);
  })
  changeCenterTask;

  // Methods
  registerCalendar() {
    if (window) {
      window.__powerCalendars = window.__powerCalendars || {}; // TODO: weakmap??
      window.__powerCalendars[this.publicAPI.uniqueId] = this;
    }
  }

  unregisterCalendar() {
    if (window) {
      delete window.__powerCalendars[guidFor(this)];
    }
  }
}
