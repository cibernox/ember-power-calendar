import Controller from '@ember/controller';

export default Controller.extend({
  center: new Date(2013, 0, 15),
  disabledDates: [
    new Date(2013, 0, 18),
    new Date(2013, 0, 21),
    new Date(2013, 0, 22),
    new Date(2013, 0, 28)
  ]
});
