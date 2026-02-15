import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendarRange from 'ember-power-calendar/components/power-calendar-range';
import type { NormalizeCalendarValue, NormalizeRangeActionValue } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked center: Date | undefined = new Date('2016-05-17');
  @tracked range: {
    start?: Date | null;
    end?: Date | null;
  } = {
    start: new Date('2016-05-10'),
    end: new Date('2016-05-15'),
  };

  @action
  onCenterChange(selected: NormalizeCalendarValue) {
    this.center = selected.date;
  }

  @action
  onSelect(selected: NormalizeRangeActionValue) {
    this.range = selected.date;
  }

  <template>
    <PowerCalendarRange
      class="demo-range-calendar-with-pretty-range-ends-yo"
      @center={{this.center}}
      @selected={{this.range}}
      @onCenterChange={{this.onCenterChange}}
      @onSelect={{this.onSelect}}
      as |calendar|
    >
      <calendar.Nav />
      <calendar.Days />
    </PowerCalendarRange>
  </template>
}
