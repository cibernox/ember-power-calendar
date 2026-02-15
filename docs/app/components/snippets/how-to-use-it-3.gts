import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';

export default class extends Component {
  @tracked wedding = new Date(2013, 9, 18);

  <template>
    <PowerCalendar @center={{this.wedding}} as |calendar|>
      <calendar.Nav />
      <calendar.Days />
    </PowerCalendar>
  </template>
}
