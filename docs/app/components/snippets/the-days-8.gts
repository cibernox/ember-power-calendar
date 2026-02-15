import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import { on } from '@ember/modifier';
import type { TWeekdayFormat } from 'ember-power-calendar/utils';

export default class extends Component {
  @tracked weekdayFormat: TWeekdayFormat | undefined;

  @action
  onChange(evt: Event) {
    this.weekdayFormat = (evt.target as HTMLInputElement).value as TWeekdayFormat;
  }

  <template>
    <PowerCalendar as |calendar|>
      <input
        type="radio"
        name="weekday-format"
        id="weekday-format-radio-button-1"
        value="min"
        {{on "change" this.onChange}}
      />
      <label for="weekday-format-radio-button-1">Min</label>
      <input
        type="radio"
        name="weekday-format"
        id="weekday-format-radio-button-2"
        value="short"
        {{on "change" this.onChange}}
      />
      <label for="weekday-format-radio-button-2">Short</label>
      <input
        type="radio"
        name="weekday-format"
        id="weekday-format-radio-button-3"
        value="long"
        {{on "change" this.onChange}}
      />
      <label for="weekday-format-radio-button-3">Long</label>

      <calendar.Days @weekdayFormat={{this.weekdayFormat}} />
    </PowerCalendar>
  </template>
}
