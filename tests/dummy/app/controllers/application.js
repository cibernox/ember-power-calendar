import Controller from '@ember/controller';
import { add } from 'ember-power-calendar-utils';

export default class extends Controller {
  tomorrow = add(new Date(), 1, 'day')
  pastMonth = add(new Date(), -1, 'month')
  nextMonth = add(new Date(), 1, 'month')
  selected = add(new Date(), 1, 'day')
}
