import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<nav class=\"ember-power-calendar-nav\">\n  {{#if @calendar.actions.moveCenter}}\n    <button\n      type=\"button\"\n      class=\"ember-power-calendar-nav-control ember-power-calendar-nav-control--previous\"\n      {{on \"click\" (fn @calendar.actions.moveCenter -1 this.unit @calendar)}}\n    >«</button>\n  {{/if}}\n  <div class=\"ember-power-calendar-nav-title\">\n    {{#if (has-block)}}\n      {{yield @calendar}}\n    {{else}}\n      {{power-calendar-format-date\n        @calendar.center\n        this.format\n        locale=@calendar.locale\n      }}\n    {{/if}}\n  </div>\n  {{#if @calendar.actions.moveCenter}}\n    <button\n      type=\"button\"\n      class=\"ember-power-calendar-nav-control ember-power-calendar-nav-control--next\"\n      {{on \"click\" (fn @calendar.actions.moveCenter 1 this.unit @calendar)}}\n    >»</button>\n  {{/if}}\n</nav>");

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
