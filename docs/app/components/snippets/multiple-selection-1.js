import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked center = new Date('2016-05-17');
  @tracked collection = [];

  @action
  onCenterChange(selected) {
    this.center = selected.date;
  }

  @action
  onSelect(selected) {
    this.collection = selected.date;
  }
}
