import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked center = new Date('2016-05-17');
  @tracked preferredDates = [];

  @action
  onSelect(selected) {
    this.preferredDates = selected.date;
  }
}
