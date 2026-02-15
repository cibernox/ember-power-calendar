import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendarRange from 'ember-power-calendar/components/power-calendar-range';
import type { NormalizeRangeActionValue } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked selectedRange: {
    start?: Date | null;
    end?: Date | null;
  } | undefined = undefined;

  @action
  onSelect(selected: NormalizeRangeActionValue) {
    this.selectedRange = selected.date;
  }

  <template>
    <PowerCalendarRange
      @selected={{this.selectedRange}}
      @proximitySelection={{true}}
      @onSelect={{this.onSelect}}
      as |cal|
    >
      <cal.Nav />
      <cal.Days />
    </PowerCalendarRange>
  </template>
}
