import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import PowerCalendarNav from 'ember-power-calendar/components/power-calendar/nav';
import { formatDate } from 'ember-power-calendar/utils';

export default class CalendarNavWithYearButtons extends PowerCalendarNav {
  <template>
    {{#if @calendar.actions.moveCenter}}
      <nav class="ember-power-calendar-nav">
        <button
          class="ember-power-calendar-nav-control"
          {{on "click" (fn @calendar.actions.moveCenter -12 "month" @calendar)}}
          type="button"
        >«</button>
        <button
          class="ember-power-calendar-nav-control"
          {{on "click" (fn @calendar.actions.moveCenter -1 "month" @calendar)}}
          type="button"
        >‹</button>
        <div class="ember-power-calendar-nav-title">
          {{formatDate @calendar.center "MMMM YYYY"}}
        </div>
        <button
          class="ember-power-calendar-nav-control"
          {{on "click" (fn @calendar.actions.moveCenter 1 "month" @calendar)}}
          type="button"
        >›</button>
        <button
          class="ember-power-calendar-nav-control"
          {{on "click" (fn @calendar.actions.moveCenter 12 "month" @calendar)}}
          type="button"
        >»</button>
      </nav>
    {{/if}}
  </template>
}
