import Controller from '@ember/controller';
import { computed } from '@ember/object';
import {
  add,
  normalizeDate,
} from 'ember-power-calendar-utils';

export default class extends Controller {
  center = new Date('2016-05-17')
  selected = null

  @computed('center')
  get nextMonthsCenter() {
    return add(this.center, 1, 'month');
  }
}
