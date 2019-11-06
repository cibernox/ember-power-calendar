import { layout, tagName } from "@ember-decorators/component";
import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import templateLayout from '../templates/components/power-calendar';
import { assert } from '@ember/debug';
import {
  add,
  normalizeDate,
  normalizeCalendarValue
} from 'ember-power-calendar-utils';

export default @layout(templateLayout) @tagName('') class extends Component {
  @service('power-calendar') powerCalendarService
  navComponent = 'power-calendar/nav'
  daysComponent = 'power-calendar/days'
  center = null
  _calendarType = 'single'

  // Lifecycle hooks
  init() {
    super.init(...arguments);
    this.registerCalendar();
    if (this.onInit) {
      this.onInit(this.publicAPI);
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.unregisterCalendar();
  }

  // CPs
  @computed('onSelect', 'onCenterChange')
  get publicActions() {
    let actions = {};
    if (this.onSelect) {
      actions.select = (...args) => this.select(...args)
    }
    if (this.onCenterChange) {
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

  @computed
  get selected() {
    return undefined;
  }
  set selected(v) {
    return normalizeDate(v);
  }

  @computed('center')
  get currentCenter() {
    let center = this.center;
    if (!center) {
      center = this.selected || this.powerCalendarService.getDate()
    }
    return normalizeDate(center);
  }

  @computed('_publicAPI')
  get publicAPI() {
    return this._publicAPI;
  }

  @computed('selected', 'currentCenter', 'locale', 'powerCalendarService.locale', 'changeCenterTask.isRunning', 'publicActions')
  get _publicAPI() {
    return {
      uniqueId: guidFor(this),
      type: this._calendarType,
      selected: this.selected,
      loading: this.changeCenterTask.isRunning,
      center: this.currentCenter,
      locale: this.locale || this.powerCalendarService.locale,
      actions: this.publicActions
    };
  }

  @computed('tag')
  get tagWithDefault() {
    if (this.tag === undefined || this.tag === null) {
      return 'div';
    }
    return this.tag;
  }

  // Actions
  @action
  select(day, calendar, e) {
    if (this.onSelect) {
      this.onSelect(day, calendar, e);
    }
  }

  // Tasks
  @(task(function* (newCenter, calendar, e) {
    assert('You attempted to move the center of a calendar that doesn\'t receive an `@onCenterChange` action.', typeof this.onCenterChange === 'function');
    let value = normalizeCalendarValue({ date: newCenter });
    yield this.onCenterChange(value, calendar, e);
  })) changeCenterTask

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
