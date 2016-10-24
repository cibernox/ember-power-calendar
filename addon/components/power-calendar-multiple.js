import CalendarComponent from './power-calendar';
import computed from 'ember-computed';
import moment from 'moment';

export default CalendarComponent.extend({
  daysComponent: 'power-calendar-multiple/days',

  // CPs
  currentCenter: computed('center', function() {
    let center = this.get('center');
    if (center) {
      return moment(center);
    }
    return moment((this.get('selected') || [])[0] || this.get('clockService').getDate());
  }),

  // Methods
  buildonSelectValue(day) {
    let selected = this.get('publicAPI.selected') || [];
    let moments = [];
    for (let i = 0; i < selected.length; i++) {
      if (day.moment.isSame(selected[i], 'day')) {
        selected.forEach((d, index) => {
          if (i !== index) {
            moments[moments.length] = moment(d);
          }
        });
        break;
      }
    }
    if (moments.length === 0) {
      moments = [...selected.map((d) => moment(d)), day.moment];
    }
    return {
      moment: moments,
      date: moments.map((m) => m._d)
    };
  }
});
