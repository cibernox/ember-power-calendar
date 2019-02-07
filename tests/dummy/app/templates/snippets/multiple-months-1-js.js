import Controller from '@ember/controller';
import { computed } from '@ember/object';
import {
  add,
  normalizeDate,
} from 'ember-power-calendar-utils';

export default Controller.extend({
  center: new Date('2016-05-17'),
  selected: null,

  nextMonthsCenter: computed('center', function() {
    return add(this.center, 1, 'month');
  }),
});
