import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import {
  formatDate,
  type NormalizeCalendarValue,
} from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked month: Date | undefined = undefined;

  @action
  onCenterChange(selected: NormalizeCalendarValue) {
    this.month = selected.date;
  }

  <template>
    <PowerCalendar
      class="demo-calendar-small"
      @center={{this.month}}
      @onCenterChange={{this.onCenterChange}}
      as |calendar|
    >
      {{#if calendar.actions.moveCenter}}
        <nav class="ember-power-calendar-nav">
          <button
            type="button"
            class="ember-power-calendar-nav-control"
            {{on "click" (fn calendar.actions.moveCenter -12 "month" calendar)}}
          >«</button>
          <button
            type="button"
            class="ember-power-calendar-nav-control"
            {{on "click" (fn calendar.actions.moveCenter -1 "month" calendar)}}
          >‹</button>
          <div class="ember-power-calendar-nav-title">
            {{formatDate calendar.center "MMMM YYYY"}}
          </div>
          <button
            class="ember-power-calendar-nav-control"
            {{on "click" (fn calendar.actions.moveCenter 1 "month" calendar)}}
            type="button"
          >›</button>
          <button
            class="ember-power-calendar-nav-control"
            {{on "click" (fn calendar.actions.moveCenter 12 "month" calendar)}}
            type="button"
          >»</button>
        </nav>
      {{/if}}

      <calendar.Days />
    </PowerCalendar>
  </template>
}
