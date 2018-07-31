import Controller from '@ember/controller';

export default Controller.extend({
  months: [
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
  ],

  actions: {
    changeYear(calendar, e) {
      let newCenter = calendar.center.clone().year(e.target.value);
      calendar.actions.changeCenter(newCenter);
    }
  }
});
