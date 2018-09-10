import Controller from '@ember/controller';

export default Controller.extend({
  wedding: new Date(2013, 9, 18),
  minDate: new Date(2013, 9, 11),
  maxDate: new Date(2013, 9, 21)
});