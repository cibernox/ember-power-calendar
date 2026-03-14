import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendar, {
  type PowerCalendarDefaultBlock,
} from 'ember-power-calendar/components/power-calendar';
import PowerSelect from 'ember-power-select/components/power-select';
import {
  formatDate,
  type NormalizeCalendarValue,
} from 'ember-power-calendar/utils';
import { fn } from '@ember/helper';
import type { Select, Selected } from 'ember-power-select/types';

interface GroupedYears {
  groupName: string;
  options: string[];
}

export default class extends Component {
  @tracked center2: Date | undefined = undefined;

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

  groupedYears: GroupedYears[] = [
    {
      groupName: "40's",
      options: Array(...(Array(10) as never[])).map((_, i) => `${i + 1940}`),
    },
    {
      groupName: "50's",
      options: Array(...(Array(10) as never[])).map((_, i) => `${i + 1950}`),
    },
    {
      groupName: "60's",
      options: Array(...(Array(10) as never[])).map((_, i) => `${i + 1960}`),
    },
    {
      groupName: "70's",
      options: Array(...(Array(10) as never[])).map((_, i) => `${i + 1970}`),
    },
    {
      groupName: "80's",
      options: Array(...(Array(10) as never[])).map((_, i) => `${i + 1980}`),
    },
    {
      groupName: "90's",
      options: Array(...(Array(10) as never[])).map((_, i) => `${i + 1990}`),
    },
    {
      groupName: "00's",
      options: Array(...(Array(10) as never[])).map((_, i) => `${i + 2000}`),
    },
  ];

  @action
  async changeCenter2(
    unit: 'month' | 'year',
    calendar: PowerCalendarDefaultBlock,
    selectedValue: Selected<string>,
    _select: Select<string>,
    e?: Event,
  ) {
    const newCenter = new Date(calendar.center);

    switch (unit) {
      case 'month': {
        const value = this.months.indexOf(selectedValue ?? '');
        newCenter.setMonth(value);
        break;
      }

      case 'year':
        newCenter.setFullYear(parseInt(selectedValue ?? ''));
        break;
    }

    if (calendar.actions.changeCenter && e) {
      await calendar.actions.changeCenter(newCenter, calendar, e);
    }
  }

  @action
  async changeCenter3(
    unit: 'month' | 'year',
    calendar: PowerCalendarDefaultBlock,
    selectedValue: Selected<GroupedYears>,
    _select: Select<GroupedYears>,
    e?: Event,
  ) {
    const newCenter = new Date(calendar.center);

    switch (unit) {
      case 'month': {
        const value = this.months.indexOf(selectedValue ?? '');
        newCenter.setMonth(value);
        break;
      }

      case 'year':
        newCenter.setFullYear(parseInt(selectedValue ?? ''));
        break;
    }

    if (calendar.actions.changeCenter && e) {
      await calendar.actions.changeCenter(newCenter, calendar, e);
    }
  }

  @action
  onCenterChange(selected: NormalizeCalendarValue) {
    this.center2 = selected.date;
  }

  <template>
    <PowerCalendar
      class="nav-with-power-select-demo"
      @center={{this.center2}}
      @onCenterChange={{this.onCenterChange}}
      as |cal|
    >
      <cal.Nav>
        <PowerSelect
          @options={{this.months}}
          @selected={{formatDate cal.center "MMMM"}}
          @matchTriggerWidth={{false}}
          @onChange={{fn this.changeCenter2 "month" cal}}
          as |month|
        >
          {{month}}
        </PowerSelect>
        <PowerSelect
          @options={{this.groupedYears}}
          @selected={{formatDate cal.center "YYYY"}}
          @onChange={{fn this.changeCenter3 "year" cal}}
          as |year|
        >
          {{year}}
        </PowerSelect>
      </cal.Nav>

      <cal.Days />}
    </PowerCalendar>
  </template>
}
