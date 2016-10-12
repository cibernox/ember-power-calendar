import Ember from 'ember';
import layout from '../templates/components/power-calendar';
import computed from 'ember-computed';

export default Ember.Component.extend({
  layout,
  month: 1,
  // CPs
  days: computed(function() {
    return Array(...Array(30)).map((_, i) => ({ number: ++i }));
  }),

  weeks: computed('days', function() {
    let days = this.get('days');
    let i = 0;
    let weeks = [];
    while (days[i]) {
      weeks.push(days.slice(i, i + 7));
      i += 7;
    }
    return weeks;
  })
});
