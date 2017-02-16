import layout from '../templates/components/power-calendar';
import Component from 'ember-component';
import computed from 'ember-computed';
import moment from 'moment';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { guidFor } from 'ember-metal/utils';

export default Component.extend({
  layout,
  classNames: ['ember-power-calendar'],
  powerCalendarService: service('power-calendar'),
  momentService: service('moment'),
  navComponent: 'power-calendar/nav',
  daysComponent: 'power-calendar/days',
  center: null,

  // Lifecycle chooks
  init() {
    this._super(...arguments);
    let changeCenter = (newCenter, calendar, e) => {
      return this.get('changeCenterTask').perform(moment(newCenter), calendar, e);
    };
    this.publicActions = {
      changeCenter,
      moveCenter: (step, unit, calendar, e) => {
        let newCenter = moment(this.get('center')).add(step, unit);
        return changeCenter(newCenter, calendar, e);
      },
      select: (...args) => this.send('select', ...args)
    };
    this.get('powerCalendarService').registerCalendar(this);
    let onInit = this.get('onInit');
    if (onInit) {
      onInit(this.get('publicAPI'));
    }
  },

  willDestroy() {
    this._super(...arguments);
    this.get('powerCalendarService').unregisterCalendar(this);
  },

  // CPs
  currentCenter: computed('center', function() {
    let center = this.get('center');
    if (center) {
      return moment(center);
    }
    return moment(this.get('selected') || this.get('powerCalendarService').getDate());
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
      locale: this.get('locale') || this.get('momentService.locale') || moment.locale(),
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
  changeCenterTask: task(function* (newCenterMoment, calendar, e) {
    yield this.get('onCenterChange')(
      { date: newCenterMoment.toDate(), moment: newCenterMoment },
      calendar,
      e
    );
  })
});
