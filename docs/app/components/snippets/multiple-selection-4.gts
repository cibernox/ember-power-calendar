import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendarMultiple from 'ember-power-calendar/components/power-calendar-multiple';
import type { NormalizeMultipleActionValue } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked collection: Date[] = [];

  @action
  onSelect(selected: NormalizeMultipleActionValue) {
    this.collection = selected.date;
  }

  <template>
    <PowerCalendarMultiple
      @selected={{this.collection}}
      @onSelect={{this.onSelect}}
      as |calendar|
    >
      <calendar.Days @maxLength={{4}} />
    </PowerCalendarMultiple>
  </template>
}
