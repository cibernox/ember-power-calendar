import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked center;

  @action
  onCenterChange(selected) {
    this.center = selected.date;
  }
}
