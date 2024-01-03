import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked center = new Date(2013, 0, 15);
  disabledDates = [
    new Date(2013, 0, 18),
    new Date(2013, 0, 21),
    new Date(2013, 0, 22),
    new Date(2013, 0, 28),
  ];

  @action
  onSelect(selected) {
    this.selected = selected.date;
  }
}
