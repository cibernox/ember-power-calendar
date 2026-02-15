import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendarMultiple from 'ember-power-calendar/components/power-calendar-multiple';
import { formatDate, type NormalizeMultipleActionValue } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked center: Date = new Date('2016-05-17');
  @tracked preferredDates: Date[] = [];

  @action
  onSelect(selected: NormalizeMultipleActionValue) {
    this.preferredDates = selected.date;
  }

  <template>
    <p>Choose the dates you prefer in the order you prefer them:</p>

    <PowerCalendarMultiple
      @center={{this.center}}
      @selected={{this.preferredDates}}
      @onSelect={{this.onSelect}}
      as |calendar|
    >
      <calendar.Nav />
      <calendar.Days />
    </PowerCalendarMultiple>

    Preferred dates:
    <ol>
      {{#each this.preferredDates as |d|}}
        <li>{{formatDate d "LLL"}}</li>
      {{/each}}
    </ol>
  </template>
}
