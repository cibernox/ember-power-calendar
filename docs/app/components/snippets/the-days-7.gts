import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import type { PowerCalendarDay } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked center: Date = new Date(2013, 0, 15);
  disabledDates: Date[] = [
    new Date(2013, 0, 18),
    new Date(2013, 0, 21),
    new Date(2013, 0, 22),
    new Date(2013, 0, 28),
  ];
  @tracked selected: Date | undefined;

  @action
  onSelect(selected: PowerCalendarDay) {
    this.selected = selected.date;
  }

  <template>
    <PowerCalendar
      @center={{this.center}}
      @selected={{this.selected}}
      @onSelect={{this.onSelect}}
      as |calendar|
    >
      <calendar.Nav />
      <calendar.Days @disabledDates={{this.disabledDates}} />
    </PowerCalendar>
  </template>
}
