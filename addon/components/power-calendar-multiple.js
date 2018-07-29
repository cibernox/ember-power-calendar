import CalendarComponent from './power-calendar';
import { computed } from '@ember/object';
import { normalizeDate, isSame } from 'ember-power-calendar/utils/date-utils';
// import moment from 'moment';

export default CalendarComponent.extend({
  daysComponent: "power-calendar-multiple/days",

  // CPs
  selected: computed({
    get() {
      return undefined;
    },
    set(_, v) {
      return Array.isArray(v) ? v.map(normalizeDate) : v;
    }
  }),
  currentCenter: computed("center", function() {
    let center = this.get("center");
    if (center) {
      return center;
    }
    return (this.get("selected") || [])[0] || this.get("powerCalendarService").getDate();
  }),

  // Actions
  actions: {
    select(day, calendar, e) {
      let action = this.get("onSelect");
      if (action) {
        action(this._buildCollection(day), calendar, e);
      }
    }
  },

  // Methods
  _buildCollection(day) {
    let selected = this.get("publicAPI.selected") || [];
    let values = [];
    let index = -1;
    for (let i = 0; i < selected.length; i++) {
      if (isSame(day.date, selected[i], "day")) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      values = [...selected, day.date];
    } else {
      values = selected.slice(0, index).concat(selected.slice(index + 1));
    }
    // let moments = values.map(d => moment(d));
    return {
      // moment: moments,
      date: values
    };
  }
});
