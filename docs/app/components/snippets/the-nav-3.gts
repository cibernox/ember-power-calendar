import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import CalendarNavWithYearButtons from 'docs/components/calendar-nav-with-year-buttons';
import type { NormalizeCalendarValue } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked month: Date | undefined = undefined;

  @action
  onCenterChange(selected: NormalizeCalendarValue) {
    this.month = selected.date;
  }

  <template>
    <PowerCalendar
      class="demo-calendar-small"
      @center={{this.month}}
      @navComponent={{CalendarNavWithYearButtons}}
      @onCenterChange={{this.onCenterChange}}
      as |calendar|
    >

      <calendar.Nav />
      <calendar.Days />
    </PowerCalendar>
  </template>
}
