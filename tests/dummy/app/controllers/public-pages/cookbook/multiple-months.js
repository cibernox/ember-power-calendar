import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { add } from 'ember-power-calendar-utils';

export default class extends Controller {
  center = new Date('2016-05-17');
  selected = undefined;
  months = [
    new Date('2016-01-15'),
    new Date('2016-02-15'),
    new Date('2016-03-15'),
    new Date('2016-04-15'),
    new Date('2016-05-15'),
    new Date('2016-06-15'),
    new Date('2016-07-15'),
    new Date('2016-08-15'),
    new Date('2016-09-15'),
    new Date('2016-10-15'),
    new Date('2016-11-15'),
    new Date('2016-12-15'),
  ];

  @computed('center')
  get nextMonthsCenter() {
    return add(this.center, 1, 'month');
  }
}
