import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendarRange from 'ember-power-calendar/components/power-calendar-range';
import type { NormalizeRangeActionValue } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked center: Date | undefined = new Date('2016-05-17');
  @tracked minimalRange: {
    start?: Date | null;
    end?: Date | null;
  } | undefined = undefined;

  @action
  onSelect(selected: NormalizeRangeActionValue) {
    this.minimalRange = selected.date;
  }

  <template>
    <PowerCalendarRange
      class="single-day-range-demo"
      @selected={{this.minimalRange}}
      @minRange={{0}}
      @onSelect={{this.onSelect}}
      as |cal|
    >
      <cal.Nav />
      <cal.Days />
    </PowerCalendarRange>
    <small>
      To help visualize it in this demo the color of the days when range starts and
      ends in the same day is red.
    </small>
  </template>
}
