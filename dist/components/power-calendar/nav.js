import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<nav class=\"ember-power-calendar-nav\">\n  {{#if @calendar.actions.moveCenter}}\n    <button type=\"button\" class=\"ember-power-calendar-nav-control ember-power-calendar-nav-control--previous\" {{on \"click\" (fn @calendar.actions.moveCenter -1 this.unit @calendar)}}>«</button>\n  {{/if}}\n  <div class=\"ember-power-calendar-nav-title\">\n    {{#if (has-block)}}\n      {{yield @calendar}}\n    {{else}}\n      {{power-calendar-format-date @calendar.center this.format locale=@calendar.locale}}\n    {{/if}}\n  </div>\n  {{#if @calendar.actions.moveCenter}}\n    <button type=\"button\" class=\"ember-power-calendar-nav-control ember-power-calendar-nav-control--next\" {{on \"click\" (fn @calendar.actions.moveCenter 1 this.unit @calendar)}}>»</button>\n  {{/if}}\n</nav>\n");

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
