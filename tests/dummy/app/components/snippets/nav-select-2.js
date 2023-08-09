import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked center2 = null;

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

  groupedYears = [
    {
      groupName: "40's",
      options: Array(...Array(10)).map((_, i) => `${i + 1940}`),
    },
    {
      groupName: "50's",
      options: Array(...Array(10)).map((_, i) => `${i + 1950}`),
    },
    {
      groupName: "60's",
      options: Array(...Array(10)).map((_, i) => `${i + 1960}`),
    },
    {
      groupName: "70's",
      options: Array(...Array(10)).map((_, i) => `${i + 1970}`),
    },
    {
      groupName: "80's",
      options: Array(...Array(10)).map((_, i) => `${i + 1980}`),
    },
    {
      groupName: "90's",
      options: Array(...Array(10)).map((_, i) => `${i + 1990}`),
    },
    {
      groupName: "00's",
      options: Array(...Array(10)).map((_, i) => `${i + 2000}`),
    },
  ];

  @action
  changeCenter2(unit, calendar, val) {
    let newCenter = calendar.center.clone()[unit](val);
    calendar.actions.changeCenter(newCenter);
  }
}
