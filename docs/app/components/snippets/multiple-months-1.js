import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { add } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked center = new Date('2016-05-17');
  @tracked selected = null;

  get nextMonthsCenter() {
    return add(this.center, 1, 'month');
  }

  @action
  onCenterChange(selected) {
    this.center = selected.date;
  }

  @action
  onSelect(selected) {
    this.selected = selected.date;
  }
}
