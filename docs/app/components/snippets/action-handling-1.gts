import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import type { NormalizeCalendarValue } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked center: Date | undefined;

  @action
  onCenterChange(selected: NormalizeCalendarValue) {
    this.center = selected.date;
  }

  <template>
    <PowerCalendar
      @center={{this.center}}
      @onCenterChange={{this.onCenterChange}}
      as |calendar|
    >
      <calendar.Nav />
      <calendar.Days />
    </PowerCalendar>
  </template>
}
