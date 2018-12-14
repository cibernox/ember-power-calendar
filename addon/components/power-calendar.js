import Component from '@ember/component';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject } from '@ember/service';
import { task } from 'ember-concurrency';
import layout from '../templates/components/power-calendar';
import { assert } from '@ember/debug';
import {
  add,
  normalizeDate,
  normalizeCalendarValue
} from 'ember-power-calendar-utils';
export default Component.extend({
  layout,
  classNames: ['ember-power-calendar'],
  powerCalendarService: inject('power-calendar'),
  navComponent: 'power-calendar/nav',
  daysComponent: 'power-calendar/days',
  center: null,
  _calendarType: 'single',

  // Lifecycle chooks
  init() {
    this._super(...arguments);
    this.registerCalendar();
    let onInit = this.get('onInit');
    if (onInit) {
      onInit(this.get('publicAPI'));
    }
  },

  willDestroy() {
    this._super(...arguments);
    this.unregisterCalendar();
  },

  // CPs
  publicActions: computed('onSelect', 'onCenterChange', function() {
    let actions = {};
    if (this.get('onSelect')) {
      actions.select = (...args) => this.send('select', ...args);
    }
    if (this.get('onCenterChange')) {
      let changeCenter = (newCenter, calendar, e) => {
        return this.get('changeCenterTask').perform(newCenter, calendar, e);
      };
      actions.changeCenter = changeCenter;
      actions.moveCenter = (step, unit, calendar, e) => {
        let newCenter = add(this.get('currentCenter'), step, unit);
        return changeCenter(newCenter, calendar, e);
      };
    }
    return actions;
  }),

  selected: computed({
    get() {
      return undefined;
    },
    set(_, v) {
      return normalizeDate(v);
    }
  }),

  currentCenter: computed('center', function() {
    let center = this.get('center');
    if (!center) {
      center = this.get('selected') || this.get('powerCalendarService').getDate()
    }
    return normalizeDate(center);
  }),

  publicAPI: computed('_publicAPI', function() {
    return this.get('_publicAPI');
  }),

  _publicAPI: computed('selected', 'currentCenter', 'locale', 'powerCalendarService.locale', 'changeCenterTask.isRunning', 'publicActions', function() {
    return {
      uniqueId: guidFor(this),
      type: this.get('_calendarType'),
      selected: this.get('selected'),
      loading: this.get('changeCenterTask.isRunning'),
      center: this.get('currentCenter'),
      locale: this.get('locale') || this.get('powerCalendarService.locale'),
      actions: this.get('publicActions')
    };
  }),

  // Actions
  actions: {
    select(day, calendar, e) {
      let action = this.get('onSelect');
      if (action) {
        action(day, calendar, e);
      }
    }
  },

  // Tasks
  changeCenterTask: task(function* (newCenter, calendar, e) {
    let action = this.get('onCenterChange');
    assert('You attempted to move the center of a calendar that doesn\'t receive an `onCenterChange` action.', typeof action === 'function');
    let value = normalizeCalendarValue({ date: newCenter });
    yield action(value, calendar, e);
  }),

  // Methods
  registerCalendar() {
    if (window) {
      window.__powerCalendars = window.__powerCalendars || {}; // TODO: weakmap??
      window.__powerCalendars[guidFor(this)] = this;
    }
  },

  unregisterCalendar() {
    if (window) {
      delete window.__powerCalendars[guidFor(this)];
    }
  }
});
