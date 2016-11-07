import Controller from 'ember-controller';
import moment from 'moment';

export default Controller.extend({
  months: moment.months(),
  years: Array(...Array(80)).map((_, i) => `${i + 1940}`),
  groupedYears: [
    { groupName: '40\'s', options: Array(...Array(10)).map((_, i) => `${i + 1940}`) },
    { groupName: '50\'s', options: Array(...Array(10)).map((_, i) => `${i + 1950}`) },
    { groupName: '60\'s', options: Array(...Array(10)).map((_, i) => `${i + 1960}`) },
    { groupName: '70\'s', options: Array(...Array(10)).map((_, i) => `${i + 1970}`) },
    { groupName: '80\'s', options: Array(...Array(10)).map((_, i) => `${i + 1980}`) },
    { groupName: '90\'s', options: Array(...Array(10)).map((_, i) => `${i + 1990}`) },
    { groupName: '00\'s', options: Array(...Array(10)).map((_, i) => `${i + 2000}`) }
  ],

  actions: {
    changeCenter(unit, calendar, e) {
      let newCenter = calendar.center.clone()[unit](e.target.value);
      calendar.actions.changeCenter(newCenter);
    },

    changeCenter2(unit, calendar, val) {
      let newCenter = calendar.center.clone()[unit](val);
      calendar.actions.changeCenter(newCenter);
    },

    changeYear(calendar, e) {
      let newCenter = calendar.center.clone().year(e.target.value);
      calendar.actions.changeCenter(newCenter);
    }
  }
});