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
  navComponent: 'power-calendar/nav',
  daysComponent: 'power-calendar/days',
  center: null,
  // Lifecycle chooks
  init() {
    this._super(...arguments);
    this.publicActions = {
      changeCenter: (...args) => this.get('changeCenterTask').perform(...args),
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

  publicAPI: computed('selected', 'currentCenter', 'locale', function() {
    return {
      selected: this.get('selected'),
      center: this.get('currentCenter'),
      locale: this.get('locale') || moment.locale(),
      actions: this.get('publicActions')
    };
  }),

  actions: {
    select(day, e) {
      let action = this.get('onSelect');
      if (action) {
        action(this.buildonSelectValue(day), e);
      }
    }
  },

  // Tasks
  changeCenterTask: task(function* (step, unit) {
    let center = this.get('center');
    let momentDate = moment(center);
    let month = momentDate.clone().add(step, unit);
    yield this.get('onCenterChange')({ date: month._d, moment: month });
  }),

  // Methods
  buildonSelectValue(day) {
    return day;
  }
});
