import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked selected = null;
  @tracked center = new Date('2016-05-17');
  months = [
    new Date('2016-01-15'),
    new Date('2016-02-15'),
    new Date('2016-03-15'),
    new Date('2016-04-15'),
    new Date('2016-05-15'),
    new Date('2016-06-15'),
    new Date('2016-07-15'),
    new Date('2016-08-15'),
    new Date('2016-09-15'),
    new Date('2016-10-15'),
    new Date('2016-11-15'),
    new Date('2016-12-15'),
  ];

  @action
  onSelect(selected) {
    this.selected = selected.date;
  }
}
