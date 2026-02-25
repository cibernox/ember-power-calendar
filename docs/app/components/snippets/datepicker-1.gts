import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import {
  formatDate,
  type NormalizeCalendarValue,
  type PowerCalendarDay,
} from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked center: Date | undefined = undefined;
  @tracked selected: Date | undefined = undefined;

  @action
  onCenterChange(selected: NormalizeCalendarValue) {
    this.center = selected.date;
  }

  @action
  onSelect(selected: PowerCalendarDay) {
    this.selected = selected.date;
  }

  <template>
    <BasicDropdown as |dropdown|>
      <div>
        <label for="datepicker-1">Date picker</label>
      </div>

      <input
        type="text"
        data-ebd-id="{{dropdown.uniqueId}}-trigger"
        class="datepicker-demo-input"
        value={{if this.selected (formatDate this.selected "DD-MM-YYYY")}}
        id="datepicker-1"
        readonly
        {{on "focus" dropdown.actions.toggle}}
      />

      <dropdown.Content class="datepicker-demo-dropdown">
        <PowerCalendar
          class="demo-calendar-small"
          @center={{this.center}}
          @onCenterChange={{this.onCenterChange}}
          @selected={{this.selected}}
          @onSelect={{this.onSelect}}
          @isDatePicker={{true}}
          @autofocus={{true}}
          as |calendar|
        >
          <calendar.Nav />
          <calendar.Days />
        </PowerCalendar>
      </dropdown.Content>
    </BasicDropdown>
  </template>
}
