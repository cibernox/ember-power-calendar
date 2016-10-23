import CalendarComponent from './power-calendar';
import computed from 'ember-computed';
import moment from 'moment';

export default CalendarComponent.extend({
  daysComponent: 'power-calendar-multiple/days',

  // CPs
  currentlyDisplayedMonth: computed('displayedMonth', function() {
    let displayedMonth = this.get('displayedMonth');
    if (displayedMonth) {
      return moment(displayedMonth);
    }
    return moment((this.get('selected') || [])[0] || this.get('clockService').getDate());
  })
});
