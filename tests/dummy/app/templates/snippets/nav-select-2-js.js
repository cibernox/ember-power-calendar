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
  years = Array(...Array(80)).map((_, i) => `${i + 1940}`)

  changeCenter2(unit, calendar, val) {
    let newCenter = calendar.center.clone()[unit](val);
    calendar.actions.changeCenter(newCenter);
  }
}
