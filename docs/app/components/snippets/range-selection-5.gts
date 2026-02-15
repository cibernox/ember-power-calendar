import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendarRange from 'ember-power-calendar/components/power-calendar-range';
import type { NormalizeCalendarValue, NormalizeRangeActionValue } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked center: Date | undefined = new Date('2016-05-17');
  @tracked largeRange: {
    start?: Date | null;
    end?: Date | null;
  } | undefined = undefined;

  @action
  onCenterChange(selected: NormalizeCalendarValue) {
    this.center = selected.date;
  }

  @action
  onSelect(selected: NormalizeRangeActionValue) {
    this.largeRange = selected.date;
  }

  <template>
    <PowerCalendarRange
      @center={{this.center}}
      @selected={{this.largeRange}}
      @minRange="1w"
      @maxRange="2w"
      @onCenterChange={{this.onCenterChange}}
      @onSelect={{this.onSelect}}
      as |cal|
    >
      <cal.Nav />
      <cal.Days />
    </PowerCalendarRange>
  </template>
}
