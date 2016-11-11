import layout from '../templates/components/power-calendar';
import Component from 'ember-component';
import computed from 'ember-computed';
import moment from 'moment';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  layout,
  classNames: ['ember-power-calendar'],
  classNameBindings: ['changeCenterTask.isRunning:ember-power-calendar--loading'],
  clockService: service('power-calendar-clock'),
  momentService: service('moment'),
  navComponent: 'power-calendar/nav',
  daysComponent: 'power-calendar/days',
  center: null,

  // Lifecycle chooks
  init() {
    this._super(...arguments);
    let changeCenter = (newCenter) => this.get('changeCenterTask').perform(moment(newCenter));
    this.publicActions = {
      changeCenter,
      moveCenter: (step, unit) => changeCenter(moment(this.get('center')).add(step, unit)),
      select: (...args) => this.send('select', ...args)
    };
  },

  // CPs
  currentCenter: computed('center', function() {
    let center = this.get('center');
    if (center) {
      return moment(center);
    }
    return moment(this.get('selected') || this.get('clockService').getDate());
  }),

  publicAPI: computed('_publicAPI', function() {
    return this.get('_publicAPI');
  }),

  _publicAPI: computed('selected', 'currentCenter', 'locale', 'momentService.locale', function() {
    return {
      selected: this.get('selected'),
      center: this.get('currentCenter'),
      locale: this.get('locale') || this.get('momentService.locale') || moment.locale(),
      actions: this.get('publicActions')
    };
  }),

  // Actions
  actions: {
    select(day, e) {
      let action = this.get('onSelect');
      if (action) {
        action(day, e);
      }
    }
  },

  // Tasks
  changeCenterTask: task(function* (newCenterMoment) {
    yield this.get('onCenterChange')({ date: newCenterMoment.toDate(), moment: newCenterMoment });
  })
});
