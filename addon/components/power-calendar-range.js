import CalendarComponent from './power-calendar';
import computed from 'ember-computed';
import moment from 'moment';
import { getProperties } from 'ember-metal/get';

export default CalendarComponent.extend({
  daysComponent: 'power-calendar-range/days',

  // CPs
  currentlyDisplayedMonth: computed('displayedMonth', function() {
    let displayedMonth = this.get('displayedMonth');
    if (displayedMonth) {
      return moment(displayedMonth);
    }
    return moment(this.get('selected.start') || this.get('clockService').getDate());
  }),

  // Methods
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
