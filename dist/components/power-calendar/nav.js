import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<nav class=\"ember-power-calendar-nav\">\n  {{#if @calendar.actions.moveCenter}}\n    <button\n      type=\"button\"\n      class=\"ember-power-calendar-nav-control ember-power-calendar-nav-control--previous\"\n      aria-label={{or @ariaLabelPreviousMonth \"Previous month\"}}\n      {{on \"click\" (fn @calendar.actions.moveCenter -1 this.unit @calendar)}}\n    >«</button>\n  {{/if}}\n  <div\n    class=\"ember-power-calendar-nav-title\"\n    id=\"ember-power-calendar-nav-title-{{@calendar.uniqueId}}\"\n    aria-live=\"polite\"\n  >\n    {{#if (has-block)}}\n      {{yield @calendar}}\n    {{else}}\n      {{power-calendar-format-date\n        @calendar.center\n        this.format\n        locale=@calendar.locale\n      }}\n    {{/if}}\n  </div>\n  {{#if @calendar.actions.moveCenter}}\n    <button\n      type=\"button\"\n      class=\"ember-power-calendar-nav-control ember-power-calendar-nav-control--next\"\n      aria-label={{or @ariaLabelNextMonth \"Next month\"}}\n      {{on \"click\" (fn @calendar.actions.moveCenter 1 this.unit @calendar)}}\n    >»</button>\n  {{/if}}\n</nav>");

class PowerCalendarNavComponent extends Component {
  get unit() {
    return this.args.unit || 'month';
  }
  get format() {
    return this.args.format || 'MMMM YYYY';
  }
}
setComponentTemplate(TEMPLATE, PowerCalendarNavComponent);

export { PowerCalendarNavComponent as default };
//# sourceMappingURL=nav.js.map
