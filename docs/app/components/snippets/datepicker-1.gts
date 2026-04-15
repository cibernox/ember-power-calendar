import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import PowerSelect from 'ember-power-select/components/power-select';
import PowerCalendar, {
  type PowerCalendarDefaultBlock,
} from 'ember-power-calendar/components/power-calendar';
import {
  formatDate,
  type NormalizeCalendarValue,
  type PowerCalendarDay,
} from 'ember-power-calendar/utils';
import { fn } from '@ember/helper';
import type { Dropdown } from 'ember-basic-dropdown/types';
import type { Select, Selected } from 'ember-power-select/types';

export default class extends Component {
  @tracked center: Date | undefined = undefined;
  @tracked selected: Date | undefined = undefined;

  dropdownApi: Dropdown | null = null;

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

  years: string[] = Array(...(Array(120) as never[])).map(
    (_, i) => `${i + 1940}`,
  );

  @action
  onCenterChange(selected: NormalizeCalendarValue) {
    this.center = selected.date;
  }

  @action
  onSelect(selected: PowerCalendarDay) {
    this.selected = selected.date;

    this.dropdownApi?.actions.close();
  }

  @action
  onClose(dropdown: Dropdown, e?: Event): boolean {
    if (
      e?.type === 'click' &&
      document.activeElement === e?.target &&
      (e?.target as HTMLElement).tagName === 'INPUT' &&
      (e?.target as HTMLElement)?.closest(
        '[data-ebd-id="' + dropdown.uniqueId + '-trigger"]',
      )
    ) {
      return false;
    }

    return true;
  }

  @action
  async changeCenter(
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
  registerAPI(api: Dropdown | null) {
    this.dropdownApi = api;
  }

  <template>
    <BasicDropdown
      @onClose={{this.onClose}}
      @renderInPlace={{false}}
      @registerAPI={{this.registerAPI}}
      as |dropdown|
    >
      <dropdown.Trigger tabindex="-1">
        <div>
          <label for="datepicker-1">Date picker</label>
        </div>

        <input
          type="text"
          class="datepicker-demo-input"
          value={{if this.selected (formatDate this.selected "DD-MM-YYYY")}}
          id="datepicker-1"
          readonly
          {{on "focus" dropdown.actions.toggle}}
        />
      </dropdown.Trigger>

      <dropdown.Content class="datepicker-demo-dropdown">
        <PowerCalendar
          class="demo-calendar-small nav-with-power-select-demo"
          @center={{this.center}}
          @onCenterChange={{this.onCenterChange}}
          @selected={{this.selected}}
          @onSelect={{this.onSelect}}
          @isDatePicker={{true}}
          as |calendar|
        >
          <calendar.Nav>
            <PowerSelect
              @options={{this.months}}
              @selected={{formatDate calendar.center "MMMM"}}
              @matchTriggerWidth={{false}}
              @onChange={{fn this.changeCenter "month" calendar}}
              as |month|
            >
              {{month}}
            </PowerSelect>
            <PowerSelect
              @options={{this.years}}
              @selected={{formatDate calendar.center "YYYY"}}
              @onChange={{fn this.changeCenter "year" calendar}}
              as |year|
            >
              {{year}}
            </PowerSelect>
          </calendar.Nav>
          <calendar.Days />
        </PowerCalendar>
      </dropdown.Content>
    </BasicDropdown>
  </template>
}
