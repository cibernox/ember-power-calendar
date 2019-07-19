import Controller from '@ember/controller';
import { computed } from '@ember/object';
import {
  add,
  isBefore,
  startOf,
  endOf,
  weekday
} from 'ember-power-calendar-utils';

export default class extends Controller {
  @computed
  get days() {
    let now = new Date();
    let day = startOf(startOf(now, 'month'), 'isoWeek');
    let lastDay = endOf(endOf(now, 'month'), 'isoWeek');
    let days = [];
    while (isBefore(day, lastDay)) {
      if (weekday(day) !== 1 && weekday(day) !== 3) { // Skip Mon/Wed
        let copy = new Date(day);
        let isCurrentMonth = copy.getMonth() === now.getMonth();
        days.push({
          date: copy,
          isCurrentMonth
        });
      }
      day = add(day, 1, "day");
    }
    return days;
  }

  @computed('noMondays')
  get weeksWithoutMondaysOrWednesday() {
    let weeks = [];
    let i = 0;
    while (this.days[i]) {
      weeks.push({ days: this.days.slice(i, i + 5) });
      i += 5;
    }
    return weeks;
  }
}
