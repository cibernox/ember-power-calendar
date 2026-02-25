import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';

export default class extends Component {
  @tracked wedding: Date | undefined = undefined;

  <template>
    <PowerCalendar @center={{this.wedding}} as |calendar|>
      <calendar.Nav />
      <calendar.Days @showDaysAround={{false}} />
    </PowerCalendar>
  </template>
}
