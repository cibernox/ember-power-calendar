import CalendarComponent from './power-calendar';
import { computed } from '@ember/object';
import {
  normalizeDate,
  isSame,
  normalizeMultipleActionValue
} from 'ember-power-calendar-utils';

export default CalendarComponent.extend({
  daysComponent: 'power-calendar-multiple/days',
  _calendarType: 'multiple',

  // CPs
  selected: computed({
    get() {
      return undefined;
    },
    set(_, v) {
      return Array.isArray(v) ? v.map(normalizeDate) : v;
    }
  }),
  currentCenter: computed('center', function() {
    let center = this.get('center');
    if (!center) {
      center = (this.get('selected') || [])[0] || this.get('powerCalendarService').getDate();
    }
    return normalizeDate(center);
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
    return normalizeMultipleActionValue({ date: values });
  }
});
