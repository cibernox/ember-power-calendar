import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked startOfWeek;

  @action
  onChange(evt) {
    this.startOfWeek = evt.target.value;
  }
}
