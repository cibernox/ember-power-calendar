import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';

export default class extends Component {
  @tracked birthday = new Date(1986, 8, 3);

  <template>
    <PowerCalendar @selected={{this.birthday}} as |calendar|>
      <calendar.Nav />
      <calendar.Days />
    </PowerCalendar>
  </template>
}
