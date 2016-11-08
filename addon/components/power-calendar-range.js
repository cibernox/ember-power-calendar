import CalendarComponent from './power-calendar';
import computed from 'ember-computed';
import moment from 'moment';
import { getProperties } from 'ember-metal/get';
import { assign } from 'ember-platform';

export default CalendarComponent.extend({
  daysComponent: 'power-calendar-range/days',
  minRange: moment.duration(1, 'day'),

  // CPs
  currentCenter: computed('center', function() {
    let center = this.get('center');
    if (center) {
      return moment(center);
    }
    return moment(this.get('selected.start') || this.get('clockService').getDate());
  }),

  minRangeDuration: computed('minRange', function() {
    let minRange = this.get('minRange');
    if (moment.isDuration(minRange)) {
      return minRange;
    }
    if (typeof minRange === 'number') {
      return moment.duration(minRange, 'days');
    }
    if (typeof minRange === 'string') {
      let [, quantity, units] = minRange.match(/(\d+)(.*)/);
      units = units.trim() || 'days';
      return moment.duration(parseInt(quantity, 10), units);
    }
  }),

  publicAPI: computed('_publicAPI', 'minRangeDuration', function() {
    return assign({ minRange: this.get('minRangeDuration') }, this.get('_publicAPI'));
  }),

  // Methods
  buildPublicAPI() {
    let publicAPI = this._super(...arguments);
    publicAPI.minRange = this._buildMinRange();
    return publicAPI;
  },

  buildonSelectValue(day) {
    let selected = this.get('publicAPI.selected') || { start: null, end: null };
    let { start, end } = getProperties(selected, 'start', 'end');
    if (start && !end) {
      let startMoment = moment(start);
      if (startMoment.isAfter(day.moment)) {
        return {
          moment: { start: day.moment, end: startMoment },
          date: {  start: day.date, end: startMoment._d }
        };
      }  else {
        return {
          moment: { start: startMoment, end: day.moment },
          date: {  start: startMoment._d, end: day.date }
        };
      }
    } else {
      return {
        moment: { start: day.moment, end: null },
        date: {  start: day.date, end: null }
      };
    }
  }
});
