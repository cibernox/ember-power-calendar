import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Controller {
  @tracked center1 = new Date(2013, 9, 18);
  @tracked center2 = new Date(2013, 9, 18);
  @tracked center3 = new Date(2013, 9, 18);
  @tracked center4 = new Date(2013, 9, 18);
  @tracked selected4 = new Date(2013, 9, 15);

  @action
  onCenterChange(property, selected) {
    this[property] = selected.date;
  }

  @action
  onSelect(property, selected) {
    this[property] = selected.date;
  }
}
