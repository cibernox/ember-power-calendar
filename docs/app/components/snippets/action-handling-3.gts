import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import type { NormalizeCalendarValue } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked selected: Date | undefined = new Date('2016-05-17');

  @action
  onSelect(selected: NormalizeCalendarValue) {
    this.selected = selected.date;
  }

  <template>
    <PowerCalendar
      @selected={{this.selected}}
      @onSelect={{this.onSelect}}
      as |calendar|
    >
      <calendar.Nav />
      <calendar.Days />
    </PowerCalendar>
  </template>
}
