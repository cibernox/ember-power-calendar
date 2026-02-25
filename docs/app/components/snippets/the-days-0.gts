import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendarMultiple, {
  type PowerCalendarMultipleAPI,
} from 'ember-power-calendar/components/power-calendar-multiple';
import type { NormalizeMultipleActionValue } from 'ember-power-calendar/utils';
import type { TDayClass } from 'ember-power-calendar/helpers/ember-power-calendar-day-classes';

export default class extends Component {
  @tracked selectedDays: Date[] | undefined = undefined;

  @action
  onSelect(selected: NormalizeMultipleActionValue) {
    this.selectedDays = selected.date;
  }

  customClass: TDayClass<PowerCalendarMultipleAPI> = (
    day,
    _calendar,
    weeks,
  ): string => {
    if (day.isSelected) {
      const currentWeek = weeks.find((w) => w.days.includes(day));

      if (!currentWeek) {
        return '';
      }

      const weekIndex = weeks.indexOf(currentWeek);
      const dayIndex = currentWeek.days.indexOf(day);
      const classes = ['custom-class-demo-day'];
      const previousWeek = weeks[weekIndex - 1];
      const nextWeek = weeks[weekIndex + 1];
      const previousDay = currentWeek.days[dayIndex - 1];
      const nextDay = currentWeek.days[dayIndex + 1];
      if (!previousDay || !previousDay.isSelected) {
        classes.push('is-horizontal-first-day');
      }
      if (!nextDay || !nextDay.isSelected) {
        classes.push('is-horizontal-last-day');
      }
      if (!previousWeek || !previousWeek.days[dayIndex]?.isSelected) {
        classes.push('is-vertical-first-day');
      }
      if (!nextWeek || !nextWeek.days[dayIndex]?.isSelected) {
        classes.push('is-vertical-last-day');
      }
      return classes.join(' ');
    }

    return '';
  };

  <template>
    <PowerCalendarMultiple
      @selected={{this.selectedDays}}
      @onSelect={{this.onSelect}}
      as |calendar|
    >
      <calendar.Nav />
      <calendar.Days
        class="custom-day-demo-calendar"
        @dayClass={{this.customClass}}
      />
    </PowerCalendarMultiple>
  </template>
}
