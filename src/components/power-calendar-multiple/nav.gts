import Component from '@glimmer/component';
import { or } from 'ember-truth-helpers';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import powerCalendarFormatDate from '../../helpers/power-calendar-format-date.ts';
import type { TPowerCalendarMoveCenterUnit } from '../power-calendar.ts';
import type { PowerCalendarMultipleAPI } from '../power-calendar-multiple.ts';

export interface PowerCalendarMultipleNavSignature {
  Args: {
    calendar: PowerCalendarMultipleAPI;
    format?: string;
    unit?: TPowerCalendarMoveCenterUnit;
    isDatePicker?: boolean;
    ariaLabelPreviousMonth?: string;
    ariaLabelNextMonth?: string;
  };
  Blocks: {
    default: [calendar: PowerCalendarMultipleAPI];
  };
}

export default class PowerCalendarMultipleNav extends Component<PowerCalendarMultipleNavSignature> {
  get unit(): TPowerCalendarMoveCenterUnit {
    return this.args.unit || 'month';
  }

  get format() {
    return this.args.format || 'MMMM YYYY';
  }

  <template>
    <nav class="ember-power-calendar-nav">
      {{#if @calendar.actions.moveCenter}}
        <button
          type="button"
          class="ember-power-calendar-nav-control ember-power-calendar-nav-control--previous"
          aria-label={{or @ariaLabelPreviousMonth "Previous month"}}
          {{on
            "click"
            (fn @calendar.actions.moveCenter -1 this.unit @calendar)
          }}
        >«</button>
      {{/if}}
      <div
        class="ember-power-calendar-nav-title"
        id="ember-power-calendar-nav-title-{{@calendar.uniqueId}}"
        aria-live="polite"
      >
        {{#if (has-block)}}
          {{yield @calendar}}
        {{else}}
          {{powerCalendarFormatDate
            @calendar.center
            this.format
            locale=@calendar.locale
          }}
        {{/if}}
      </div>
      {{#if @calendar.actions.moveCenter}}
        <button
          type="button"
          class="ember-power-calendar-nav-control ember-power-calendar-nav-control--next"
          aria-label={{or @ariaLabelNextMonth "Next month"}}
          {{on "click" (fn @calendar.actions.moveCenter 1 this.unit @calendar)}}
        >»</button>
      {{/if}}
    </nav>
  </template>
}
