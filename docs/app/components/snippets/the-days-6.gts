import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import type { PowerCalendarDay } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked wedding: Date = new Date(2013, 9, 18);
  @tracked minDate: Date = new Date(2013, 9, 11);
  @tracked maxDate: Date = new Date(2013, 9, 21);
  @tracked selected: Date | undefined;

  @action
  onSelect(selected: PowerCalendarDay) {
    this.selected = selected.date;
  }

  <template>
    <PowerCalendar
      @center={{this.wedding}}
      @selected={{this.selected}}
      @onSelect={{this.onSelect}}
      as |calendar|
    >
      <calendar.Nav />
      <calendar.Days @minDate={{this.minDate}} @maxDate={{this.maxDate}} />
    </PowerCalendar>
  </template>
}
