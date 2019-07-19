import Controller from '@ember/controller';

export default class extends Controller {
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
  ]

  changeYear(calendar, e) {
    let newCenter = calendar.center.clone().year(e.target.value);
    calendar.actions.changeCenter(newCenter);
  }
}
