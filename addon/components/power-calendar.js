import layout from '../templates/components/power-calendar';
import Component from 'ember-component';
import computed from 'ember-computed';
import moment from 'moment';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  layout,
  classNames: ['ember-power-calendar'],
  classNameBindings: ['changeMonthTask.isRunning:ember-power-calendar--loading'],
  clockService: service('power-calendar-clock'),
  navComponent: 'power-calendar/nav',
  daysComponent: 'power-calendar/days',
  displayedMonth: null,
  // Lifecycle chooks
  init() {
    this._super(...arguments);
    this.publicActions = {
      changeMonth: (...args) => this.get('changeMonthTask').perform(...args),
      select: (...args) => this.send('select', ...args)
    };
  },

  // CPs
  currentlyDisplayedMonth: computed('displayedMonth', function() {
    let displayedMonth = this.get('displayedMonth');
    if (displayedMonth) {
      return moment(displayedMonth);
    }
    return moment(this.get('selected') || this.get('clockService').getDate());
  }),

  publicAPI: computed('selected', 'currentlyDisplayedMonth', function() {
    return {
      selected: this.get('selected'),
      displayedMonth: this.get('currentlyDisplayedMonth'),
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
  changeMonthTask: task(function* (step) {
    let displayedMonth = this.get('displayedMonth');
    let momentDate = moment(displayedMonth);
    let month = momentDate.clone().add(step, 'month');
    yield this.get('onMonthChange')({ date: month._d, moment: month });
  }),

  // Methods
  buildonSelectValue(day) {
    return day;
  }
});
