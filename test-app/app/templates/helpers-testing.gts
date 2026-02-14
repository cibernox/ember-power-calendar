import Component from '@glimmer/component';
import RouteTemplate from 'ember-route-template';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import PowerCalendar, {
  type CalendarDay,
} from 'ember-power-calendar/components/power-calendar';
import type {
  NormalizeCalendarValue,
  PowerCalendarDay,
} from 'ember-power-calendar/utils';

class HelpersTesting extends Component {
  @tracked center1: Date | undefined = new Date(2013, 9, 18);
  @tracked center2: Date | undefined = new Date(2013, 9, 18);
  @tracked center3: Date | undefined = new Date(2013, 9, 18);
  @tracked center4: Date | undefined = new Date(2013, 9, 18);
  @tracked selected4: Date | undefined = new Date(2013, 9, 15);

  get selected4Value() {
    return this.selected4 ? this.selected4.toDateString() : '';
  }

  @action
  onCenterChange(
    property: 'center1' | 'center2' | 'center3' | 'center4',
    selected: NormalizeCalendarValue,
  ) {
    this[property] = selected.date;
  }

  @action
  onSelect(property: 'selected4', selected: CalendarDay) {
    this[property] = (selected as PowerCalendarDay).date;
  }

  <template>
    <h3>Helpers testing</h3>
    <div class="calendar-center-1">
      <PowerCalendar
        @center={{this.center1}}
        @onCenterChange={{fn this.onCenterChange "center1"}}
        as |calendar|
      >
        <calendar.Nav />
        <calendar.Days />
      </PowerCalendar>
    </div>

    <div class="calendar-center-2">
      <PowerCalendar
        class="calendar-center-2-calendar"
        @center={{this.center2}}
        @onCenterChange={{fn this.onCenterChange "center2"}}
        as |calendar|
      >
        <calendar.Nav />
        <calendar.Days />
      </PowerCalendar>
    </div>

    <div class="calendar-center-3">
      <PowerCalendar @center={{this.center3}} as |calendar|>
        <calendar.Nav />
        <calendar.Days />
      </PowerCalendar>
    </div>

    <div class="calendar-center-4">
      <PowerCalendar
        @center={{this.center4}}
        @onCenterChange={{fn this.onCenterChange "center4"}}
        as |calendar|
      >
        <calendar.Nav />
        <calendar.Days />
      </PowerCalendar>
    </div>

    <div class="calendar-select-1">
      <PowerCalendar
        @center={{this.center4}}
        @selected={{this.selected4}}
        @onSelect={{fn this.onSelect "selected4"}}
        @onCenterChange={{fn this.onCenterChange "center4"}}
        as |calendar|
      >
        <calendar.Nav />
        <calendar.Days />
      </PowerCalendar>
    </div>

    <div class="calendar-select-2">
      <PowerCalendar
        @center={{this.center4}}
        @selected={{this.selected4}}
        @onSelect={{fn this.onSelect "selected4"}}
        @onCenterChange={{fn this.onCenterChange "center4"}}
        as |calendar|
      >
        <calendar.Nav />
        <calendar.Days />
      </PowerCalendar>
    </div>

    <div class="calendar-in-dropdown">
      <BasicDropdown as |dropdown|>
        <dropdown.Trigger>
          {{! template-lint-disable require-input-label }}
          <input value={{this.selected4Value}} name="date" readonly="true" />
        </dropdown.Trigger>
        <dropdown.Content class="dropdown-content">
          <PowerCalendar
            @center={{this.center4}}
            @selected={{this.selected4}}
            @onSelect={{fn this.onSelect "selected4"}}
            @onCenterChange={{fn this.onCenterChange "center4"}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </dropdown.Content>
      </BasicDropdown>
    </div>
  </template>
}

export default RouteTemplate(HelpersTesting);
