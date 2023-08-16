import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked center = null;

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  years = Array(...Array(80)).map((_, i) => `${i + 1940}`);

  @action
  changeCenter(unit, calendar, e) {
    let newCenter = calendar.center.clone()[unit](e.target.value);
    calendar.actions.changeCenter(newCenter);
  }

  @action
  onCenterChange(selected) {
    this.center = selected.date;
  }
}
