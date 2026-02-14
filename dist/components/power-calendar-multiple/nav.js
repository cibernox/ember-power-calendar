import Component from '@glimmer/component';
import { or } from 'ember-truth-helpers';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import powerCalendarFormatDate from '../../helpers/power-calendar-format-date.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

class PowerCalendarMultipleNav extends Component {
  get unit() {
    return this.args.unit || 'month';
  }
  get format() {
    return this.args.format || 'MMMM YYYY';
  }
  static {
    setComponentTemplate(precompileTemplate("\n    <nav class=\"ember-power-calendar-nav\">\n      {{#if @calendar.actions.moveCenter}}\n        <button type=\"button\" class=\"ember-power-calendar-nav-control ember-power-calendar-nav-control--previous\" aria-label={{or @ariaLabelPreviousMonth \"Previous month\"}} {{on \"click\" (fn @calendar.actions.moveCenter -1 this.unit @calendar)}}>\xAB</button>\n      {{/if}}\n      <div class=\"ember-power-calendar-nav-title\" id=\"ember-power-calendar-nav-title-{{@calendar.uniqueId}}\" aria-live=\"polite\">\n        {{#if (has-block)}}\n          {{yield @calendar}}\n        {{else}}\n          {{powerCalendarFormatDate @calendar.center this.format locale=@calendar.locale}}\n        {{/if}}\n      </div>\n      {{#if @calendar.actions.moveCenter}}\n        <button type=\"button\" class=\"ember-power-calendar-nav-control ember-power-calendar-nav-control--next\" aria-label={{or @ariaLabelNextMonth \"Next month\"}} {{on \"click\" (fn @calendar.actions.moveCenter 1 this.unit @calendar)}}>\xBB</button>\n      {{/if}}\n    </nav>\n  ", {
      strictMode: true,
      scope: () => ({
        or,
        on,
        fn,
        powerCalendarFormatDate
      })
    }), this);
  }
}

export { PowerCalendarMultipleNav as default };
//# sourceMappingURL=nav.js.map
