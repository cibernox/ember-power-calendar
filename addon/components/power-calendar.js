import Component from '@ember/component';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject } from '@ember/service';
import { task } from 'ember-concurrency';
import layout from '../templates/components/power-calendar';
import { assert } from '@ember/debug';
import { add } from "ember-power-calendar/utils/date-utils";
export default Component.extend({
  layout,
  classNames: ['ember-power-calendar'],
  powerCalendarService: inject('power-calendar'),
  // momentService: inject('moment'),
  navComponent: 'power-calendar/nav',
  daysComponent: 'power-calendar/days',
  center: null,

  // Lifecycle chooks
  init() {
    this._super(...arguments);
    let changeCenter = (newCenter, calendar, e) => {
      return this.get('changeCenterTask').perform(newCenter, calendar, e);
    };
    this.publicActions = {
      changeCenter,
      moveCenter: (step, unit, calendar, e) => {
        let newCenter = add(this.get('currentCenter'), step, unit);
        return changeCenter(newCenter, calendar, e);
      },
      select: (...args) => this.send('select', ...args)
    };
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
  currentCenter: computed('center', function() {
    let center = this.get('center');
    if (center) {
      // return moment(center);
      return center;
    }
    // return moment(this.get('selected') || this.get('powerCalendarService').getDate());
    return this.get('selected') || this.get('powerCalendarService').getDate()
  }),

  publicAPI: computed('_publicAPI', function() {
    return this.get('_publicAPI');
  }),

  _publicAPI: computed('selected', 'currentCenter', 'locale', 'momentService.locale', 'changeCenterTask.isRunning', function() {
    return {
      uniqueId: guidFor(this),
      selected: this.get('selected'),
      loading: this.get('changeCenterTask.isRunning'),
      center: this.get('currentCenter'),

      locale: this.get('locale') || this.get('momentService.locale'),
      // locale: this.get('locale') || this.get('momentService.locale') || moment.locale(),

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
    let value = {
      date: newCenter,
      // moment: newCenter
    };
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
