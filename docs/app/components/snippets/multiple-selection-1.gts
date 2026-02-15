import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendarMultiple from 'ember-power-calendar/components/power-calendar-multiple';
import type {
  NormalizeCalendarValue,
  NormalizeMultipleActionValue,
} from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked center: Date | undefined = new Date('2016-05-17');
  @tracked collection: Date[] = [];

  @action
  onCenterChange(selected: NormalizeCalendarValue) {
    this.center = selected.date;
  }

  @action
  onSelect(selected: NormalizeMultipleActionValue) {
    this.collection = selected.date;
  }

  <template>
    <PowerCalendarMultiple
      @center={{this.center}}
      @selected={{this.collection}}
      @onSelect={{this.onSelect}}
      @onCenterChange={{this.onCenterChange}}
      as |calendar|
    >
      <calendar.Nav />
      <calendar.Days />
    </PowerCalendarMultiple>
  </template>
}
