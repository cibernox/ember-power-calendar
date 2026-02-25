import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendarRange from 'ember-power-calendar/components/power-calendar-range';
import type {
  NormalizeCalendarValue,
  NormalizeRangeActionValue,
} from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked center: Date | undefined = new Date('2016-05-17');
  @tracked mediumRange:
    | {
        start?: Date | null;
        end?: Date | null;
      }
    | undefined = undefined;
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
    this.mediumRange = selected.date;
  }

  <template>
    <PowerCalendarRange
      @center={{this.center}}
      @selected={{this.mediumRange}}
      @minRange={{3}}
      @onCenterChange={{this.onCenterChange}}
      @onSelect={{this.onSelect}}
      as |cal|
    >
      <cal.Nav />
      <cal.Days />
    </PowerCalendarRange>
  </template>
}
