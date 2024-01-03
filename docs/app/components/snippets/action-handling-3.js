import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked selected = new Date('2016-05-17');

  @action
  onSelect(selected) {
    this.selected = selected.date;
  }
}
