import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked month = null;

  @action
  onCenterChange(selected) {
    this.month = selected.date;
  }
}
