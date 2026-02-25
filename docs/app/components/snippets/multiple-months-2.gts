import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendarRange from 'ember-power-calendar/components/power-calendar-range';
import powerCalendarFormatDate from 'ember-power-calendar/helpers/power-calendar-format-date';
import type {
  NormalizeRangeActionValue,
  SelectedPowerCalendarRange,
} from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked selected: SelectedPowerCalendarRange | undefined = undefined;
  @tracked center: Date = new Date('2016-05-17');

  months: Date[] = [
    new Date('2016-01-15'),
    new Date('2016-02-15'),
    new Date('2016-03-15'),
    new Date('2016-04-15'),
    new Date('2016-05-15'),
    new Date('2016-06-15'),
    new Date('2016-07-15'),
    new Date('2016-08-15'),
    new Date('2016-09-15'),
    new Date('2016-10-15'),
    new Date('2016-11-15'),
    new Date('2016-12-15'),
  ];

  @action
  onSelect(selected: NormalizeRangeActionValue) {
    this.selected = selected.date;
  }

  <template>
    <PowerCalendarRange
      class="multiple-month-power-calendar-vertical"
      @selected={{this.selected}}
      @onSelect={{this.onSelect}}
      as |calendar|
    >
      <div class="months-container">
        {{#each this.months as |month|}}
          <calendar.Nav>
            {{powerCalendarFormatDate month "MMMM" locale=calendar.locale}}
          </calendar.Nav>
          <calendar.Days @center={{month}} @showDaysAround={{false}} />
        {{/each}}
      </div>
    </PowerCalendarRange>
  </template>
}
