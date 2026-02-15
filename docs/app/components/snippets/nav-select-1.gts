import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendar, { type PowerCalendarDefaultBlock } from 'ember-power-calendar/components/power-calendar';
import { formatDate } from 'ember-power-calendar/utils';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { eq } from 'ember-truth-helpers';
import type { NormalizeCalendarValue } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked center: Date | undefined = undefined;

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

  years: string[] = Array(...(Array(80) as never[])).map((_, i) => `${i + 1940}`);

  @action
  async changeCenter(unit: 'month' | 'year', calendar: PowerCalendarDefaultBlock, e: Event) {
    const selectedValue = (e.target as HTMLSelectElement)?.value;

    const newCenter = new Date(calendar.center);

    switch (unit) {
      case 'month': {
        const value = this.months.indexOf(selectedValue);
        newCenter.setMonth(value);
        break;
      }

      case 'year':
        newCenter.setFullYear(parseInt(selectedValue));
        break;
    }

    if (calendar.actions.changeCenter) {
      await calendar.actions.changeCenter(newCenter, calendar, e);
    }
  }

  @action
  onCenterChange(selected: NormalizeCalendarValue) {
    this.center = selected.date;
  }

  <template>
    <PowerCalendar
      @center={{this.center}}
      @onCenterChange={{this.onCenterChange}}
      as |calendar|
    >

      <calendar.Nav>
        <span class="with-invisible-select">
          {{#let (formatDate calendar.center "MMMM") as |currentMonth|}}
            {{currentMonth}}
            {{! template-lint-disable require-input-label }}
            <select {{on "change" (fn this.changeCenter "month" calendar)}}>
              {{#each this.months as |month|}}
                <option
                  value="{{month}}"
                  selected={{eq month currentMonth}}
                >{{month}}</option>
              {{/each}}
            </select>
          {{/let}}
        </span>
        <span class="with-invisible-select">
          {{#let (formatDate calendar.center "YYYY") as |currentYear|}}
            {{currentYear}}
            {{! template-lint-disable require-input-label }}
            <select {{on "change" (fn this.changeCenter "year" calendar)}}>
              {{#each this.years as |year|}}
                <option
                  value="{{year}}"
                  selected={{eq year currentYear}}
                >{{year}}</option>
              {{/each}}
            </select>
          {{/let}}
        </span>
      </calendar.Nav>

      <calendar.Days />
    </PowerCalendar>
  </template>
}
