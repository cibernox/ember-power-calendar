import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject } from '@ember/service';
import { withLocale, isBefore, add, normalizeDate, isBetween, isSame, diff, getWeekdaysMin, getWeekdaysShort, getWeekdays } from '../../utils.js';
import { l as localeStartOfWeekOrFallback, w as weekdaysNames, a as lastDay, f as firstDay, c as weeks, h as handleDayKeyDown, d as focusDate, e as handleClick, b as buildDay } from '../../days-utils-D13uOiMt.js';
import { precompileTemplate } from '@ember/template-compilation';
import { g, i, n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{! template-lint-disable no-invalid-interactive }}\n<div\n  class=\"ember-power-calendar-days\"\n  data-power-calendar-id={{or @calendar.calendarUniqueId @calendar.uniqueId}}\n  {{on \"click\" this.handleClick}}\n  ...attributes\n>\n  <div class=\"ember-power-calendar-row ember-power-calendar-weekdays\">\n    {{#each this.weekdaysNames as |wdn|}}\n      <div class=\"ember-power-calendar-weekday\">{{wdn}}</div>\n    {{/each}}\n  </div>\n  <div\n    class=\"ember-power-calendar-day-grid\"\n    {{on \"keydown\" this.handleKeyDown}}\n  >\n    {{#each this.weeks key=\"id\" as |week|}}\n      <div\n        class=\"ember-power-calendar-row ember-power-calendar-week\"\n        data-missing-days={{week.missingDays}}\n      >\n        {{#each week.days key=\"id\" as |day|}}\n          <button\n            type=\"button\"\n            data-date=\"{{day.id}}\"\n            class={{ember-power-calendar-day-classes\n              day\n              @calendar\n              this.weeks\n              @dayClass\n            }}\n            {{on \"focus\" this.handleDayFocus}}\n            {{on \"blur\" this.handleDayBlur}}\n            disabled={{day.isDisabled}}\n          >\n            {{#if (has-block)}}\n              {{yield day @calendar this.weeks}}\n            {{else}}\n              {{day.number}}\n            {{/if}}\n          </button>\n        {{/each}}\n      </div>\n    {{/each}}\n  </div>\n</div>");

class PowerCalendarRangeDaysComponent extends Component {
  static {
    g(this.prototype, "powerCalendar", [inject]);
  }
  #powerCalendar = (i(this, "powerCalendar"), undefined);
  static {
    g(this.prototype, "focusedId", [tracked], function () {
      return null;
    });
  }
  #focusedId = (i(this, "focusedId"), undefined);
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
      days.push(this.buildDay(day, today, this.args.calendar));
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
      center = this.args.selected?.start || this.args.calendar.center;
    }
    return normalizeDate(center) || this.args.calendar.center;
  }

  // Actions
  handleDayFocus(e) {
    scheduleOnce('actions', this, this._updateFocused.bind(this), e.target.dataset['date']);
  }
  static {
    n(this.prototype, "handleDayFocus", [action]);
  }
  handleDayBlur() {
    scheduleOnce('actions', this, this._updateFocused.bind(this), null);
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
  buildDay(date, today, calendar) {
    const day = buildDay(date, today, calendar, this.focusedId, this.currentCenter, this.dayIsSelected.bind(this), this.args.minDate, this.args.maxDate, this.args.disabledDates);
    const {
      start,
      end
    } = calendar.selected || {
      start: null,
      end: null
    };
    if (start && end) {
      day.isSelected = isBetween(date, start, end, 'day', '[]');
      day.isRangeStart = day.isSelected && isSame(date, start, 'day');
      day.isRangeEnd = day.isSelected && isSame(date, end, 'day');
    } else {
      day.isRangeEnd = false;
      if (!start) {
        day.isRangeStart = false;
      } else {
        day.isRangeStart = day.isSelected = isSame(date, start, 'day');
        if (!day.isDisabled) {
          const diffInMs = Math.abs(diff(day.date, start));
          const minRange = calendar.minRange;
          const maxRange = calendar.maxRange;
          day.isDisabled = minRange && diffInMs < minRange || maxRange !== null && maxRange !== undefined && diffInMs > maxRange;
        }
      }
    }
    return day;
  }
  dayIsSelected() {
    return false;
  }
  _updateFocused(id) {
    this.focusedId = id ?? null;
  }
}
setComponentTemplate(TEMPLATE, PowerCalendarRangeDaysComponent);

export { PowerCalendarRangeDaysComponent as default };
//# sourceMappingURL=days.js.map
