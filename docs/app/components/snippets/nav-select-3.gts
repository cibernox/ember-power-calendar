import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import PowerCalendar, {
  type PowerCalendarDefaultBlock,
} from 'ember-power-calendar/components/power-calendar';
import {
  formatDate,
  type NormalizeCalendarValue,
} from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked center3: Date | undefined = undefined;

  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  @action
  async changeYear(calendar: PowerCalendarDefaultBlock, e: Event) {
    const selectedValue = (e.target as HTMLSelectElement)?.value;

    const newCenter = new Date(calendar.center);

    newCenter.setFullYear(parseInt(selectedValue));

    if (calendar.actions.changeCenter) {
      await calendar.actions.changeCenter(newCenter, calendar, e);
    }
  }

  @action
  onCenterChange(selected: NormalizeCalendarValue) {
    this.center3 = selected.date;
  }

  <template>
    <PowerCalendar
      class="nav-with-number-input-demo"
      @center={{this.center3}}
      @onCenterChange={{this.onCenterChange}}
      as |cal|
    >
      <cal.Nav>
        {{formatDate cal.center "MMMM"}}
        {{! template-lint-disable require-input-label }}
        <input
          type="number"
          min="1940"
          max="2020"
          value={{formatDate cal.center "YYYY"}}
          {{on "input" (fn this.changeYear cal)}}
        />
      </cal.Nav>

      <cal.Days />
    </PowerCalendar>
  </template>
}
