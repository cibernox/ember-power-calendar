import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject } from '@ember/service';
import { withLocale, isBefore, add, normalizeDate, isSame, getWeekdaysMin, getWeekdaysShort, getWeekdays } from '../../utils.js';
import { l as localeStartOfWeekOrFallback, w as weekdaysNames, a as lastDay, f as firstDay, b as buildDay, c as weeks, h as handleDayKeyDown, d as focusDate, e as handleClick, g as dayIsDisabled } from '../../days-utils-D13uOiMt.js';
import { precompileTemplate } from '@ember/template-compilation';
import { g, i, n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{! template-lint-disable no-invalid-interactive }}\n<div\n  class=\"ember-power-calendar-days\"\n  data-power-calendar-id={{or @calendar.calendarUniqueId @calendar.uniqueId}}\n  {{on \"click\" this.handleClick}}\n  ...attributes\n>\n  <div class=\"ember-power-calendar-row ember-power-calendar-weekdays\">\n    {{#each this.weekdaysNames as |wdn|}}\n      <div class=\"ember-power-calendar-weekday\">{{wdn}}</div>\n    {{/each}}\n  </div>\n  <div class=\"ember-power-calendar-day-grid\" {{on \"keydown\" this.handleKeyDown}}>\n    {{#each this.weeks key=\'id\' as |week|}}\n      <div class=\"ember-power-calendar-row ember-power-calendar-week\" data-missing-days={{week.missingDays}}>\n        {{#each week.days key=\'id\' as |day|}}\n          <button type=\"button\"\n            data-date=\"{{day.id}}\"\n            class={{ember-power-calendar-day-classes day @calendar this.weeks @dayClass}}\n            {{on \"focus\" this.handleDayFocus}}\n            {{on \"blur\" this.handleDayBlur}}\n            disabled={{day.isDisabled}}>\n            {{#if (has-block)}}\n              {{yield day @calendar this.weeks}}\n            {{else}}\n              {{day.number}}\n            {{/if}}\n          </button>\n        {{/each}}\n      </div>\n    {{/each}}\n  </div>\n</div>\n");

class PowerCalendarMultipleDaysComponent extends Component {
  static {
    g(this.prototype, "powerCalendar", [inject]);
  }
  #powerCalendar = (i(this, "powerCalendar"), void 0);
  static {
    g(this.prototype, "focusedId", [tracked], function () {
      return null;
    });
  }
  #focusedId = (i(this, "focusedId"), void 0);
  get weekdayFormat() {
    return this.args.weekdayFormat || 'short'; // "min" | "short" | "long"
  }
  get showDaysAround() {
    return this.args.showDaysAround !== undefined ? this.args.showDaysAround : true;
  }
  get weekdaysMin() {
    return withLocale(this.args.calendar.locale, getWeekdaysMin);
  }
  get weekdaysShort() {
    return withLocale(this.args.calendar.locale, getWeekdaysShort);
  }
  get weekdays() {
    return withLocale(this.args.calendar.locale, getWeekdays);
  }
  get localeStartOfWeek() {
    return localeStartOfWeekOrFallback(this.args.startOfWeek, this.args.calendar.locale);
  }
  get weekdaysNames() {
    return weekdaysNames(this.localeStartOfWeek, this.weekdayFormat, this.weekdays, this.weekdaysMin, this.weekdaysShort);
  }
  get days() {
    const today = this.powerCalendar.getDate();
    const theLastDay = lastDay(this.localeStartOfWeek, this.currentCenter);
    let day = firstDay(this.currentCenter, this.localeStartOfWeek);
    const days = [];
    while (isBefore(day, theLastDay)) {
      days.push(buildDay(day, today, this.args.calendar, this.focusedId, this.currentCenter, this.dayIsSelected.bind(this), this.args.minDate, this.args.maxDate, this.args.disabledDates, this.dayIsDisabled.bind(this)));
      day = add(day, 1, 'day');
    }
    return days;
  }
  get weeks() {
    return weeks(this.days, this.showDaysAround);
  }
  get currentCenter() {
    let center = this.args.center;
    if (!center) {
      center = this.args.selected ? this.args.selected[0] : this.args.calendar.center;
    }
    return normalizeDate(center) || this.args.calendar.center;
  }
  get maxLength() {
    return this.args.maxLength || Infinity;
  }

  // Actions
  handleDayFocus(e) {
    scheduleOnce('actions', this, this._updateFocused, e.target.dataset['date']);
  }
  static {
    n(this.prototype, "handleDayFocus", [action]);
  }
  handleDayBlur() {
    scheduleOnce('actions', this, this._updateFocused, null);
  }
  static {
    n(this.prototype, "handleDayBlur", [action]);
  }
  handleKeyDown(e) {
    const day = handleDayKeyDown(e, this.focusedId, this.days);
    if (!day) {
      return;
    }
    this.focusedId = day.id;
    scheduleOnce('afterRender', this, focusDate, this.args.calendar.uniqueId, this.focusedId ?? '');
  }
  static {
    n(this.prototype, "handleKeyDown", [action]);
  }
  handleClick(e) {
    handleClick(e, this.days, this.args.calendar);
  }

  // Methods
  static {
    n(this.prototype, "handleClick", [action]);
  }
  dayIsSelected(date, calendar = this.args.calendar) {
    const selected = calendar.selected || [];
    return selected.some(d => isSame(date, d, 'day'));
  }
  _updateFocused(id) {
    this.focusedId = id ?? null;
  }
  dayIsDisabled(date, calendarApi, minDate, maxDate, disabledDates) {
    const calendar = calendarApi;
    const numSelected = calendar.selected && calendar.selected.length || 0;
    const maxLength = this.maxLength || Infinity;
    return dayIsDisabled(date, calendar, minDate, maxDate, disabledDates) || numSelected >= maxLength && !this.dayIsSelected(date);
  }
}
setComponentTemplate(TEMPLATE, PowerCalendarMultipleDaysComponent);

export { PowerCalendarMultipleDaysComponent as default };
//# sourceMappingURL=days.js.map
