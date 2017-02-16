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
    return moment((this.get('selected') || [])[0] || this.get('powerCalendarService').getDate());
  }),

  // Actions
  actions: {
    select(day, calendar, e) {
      let action = this.get('onSelect');
      if (action) {
        action(this._buildCollection(day), calendar, e);
      }
    }
  },

  // Methods
  _buildCollection(day) {
    let selected = this.get('publicAPI.selected') || [];
    let values = [];
    let index = -1;
    for (let i = 0; i < selected.length; i++) {
      if (day.moment.isSame(selected[i], 'day')) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      values = [...selected, day.moment];
    } else {
      values = selected.slice(0, index).concat(selected.slice(index + 1));
    }
    let moments = values.map((d) => moment(d));
    return {
      moment: moments,
      date: moments.map((m) => m.toDate())
    };
  }
});
