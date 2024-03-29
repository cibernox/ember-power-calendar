import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Component {
  @tracked selectedDays = null;

  @action
  onSelect(selected) {
    this.selectedDays = selected.date;
  }

  customClass(day, _calendar, weeks) {
    if (day.isSelected) {
      let currentWeek = weeks.find((w) => w.days.includes(day));
      let weekIndex = weeks.indexOf(currentWeek);
      let dayIndex = currentWeek.days.indexOf(day);
      let classes = ['custom-class-demo-day'];
      let previousWeek = weeks[weekIndex - 1];
      let nextWeek = weeks[weekIndex + 1];
      let previousDay = currentWeek.days[dayIndex - 1];
      let nextDay = currentWeek.days[dayIndex + 1];
      if (!previousDay || !previousDay.isSelected) {
        classes.push('is-horizontal-first-day');
      }
      if (!nextDay || !nextDay.isSelected) {
        classes.push('is-horizontal-last-day');
      }
      if (!previousWeek || !previousWeek.days[dayIndex].isSelected) {
        classes.push('is-vertical-first-day');
      }
      if (!nextWeek || !nextWeek.days[dayIndex].isSelected) {
        classes.push('is-vertical-last-day');
      }
      return classes.join(' ');
    }
  }
}
