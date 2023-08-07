import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked center3 = null;
  
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  @action
  changeYear(calendar, e) {
    let newCenter = calendar.center.clone().year(e.target.value);
    calendar.actions.changeCenter(newCenter);
  }
}
