import Component from '@glimmer/component';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import DaysGridWithoutMonOrWed from '../days-grid-without-mon-or-wed';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class extends Component {
  <template>
    <PowerCalendar @daysComponent={{DaysGridWithoutMonOrWed}} as |calendar|>
      <calendar.Nav />
      <calendar.Days />
    </PowerCalendar>
  </template>
}
