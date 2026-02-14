import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { modifier } from 'ember-modifier';
import { s as service, l as localeStartOfWeekOrFallback, w as weekdaysNames, a as lastDay, f as firstDay, b as buildDay, c as weeks, h as handleDayKeyDown, d as focusDate, e as handleClick, g as dayIsDisabled } from '../../days-utils-DYG5o-Ye.js';
import { withLocale, getWeekdaysMin, getWeekdaysShort, getWeekdays, isBefore, add, normalizeDate, formatDate, isSame } from '../../utils.js';
import { or } from 'ember-truth-helpers';
import { on } from '@ember/modifier';
import emberPowerCalendarDayClasses from '../../helpers/ember-power-calendar-day-classes.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { g, i, n } from 'decorator-transforms/runtime';

class PowerCalendarDays extends Component {
  static {
    g(this.prototype, "powerCalendar", [service]);
  }
  #powerCalendar = (i(this, "powerCalendar"), void 0);
  static {
    g(this.prototype, "focusedId", [tracked], function () {
      return null;
    });
  }
  #focusedId = (i(this, "focusedId"), void 0);
  didSetup = false;
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
      days.push(buildDay(day, today, this.args.calendar, this.focusedId, this.currentCenter, this.dayIsSelected.bind(this), this.args.minDate, this.args.maxDate, this.args.disabledDates));
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
      center = this.args.selected || this.args.calendar.center;
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
  async handleKeyDown(e) {
    const day = handleDayKeyDown(e, this.focusedId, this.days);
    if (!day || !day?.isCurrentMonth) {
      if (this.args.calendar.actions.moveCenter) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
          const currentDay = this.days.find(x => x.id === this.focusedId)?.date;
          if (currentDay) {
            let date = currentDay;
            let step = 1;
            if (e.key === 'ArrowUp') {
              date = add(currentDay, -7, 'day');
              step = -1;
            } else if (e.key === 'ArrowLeft') {
              date = add(currentDay, -1, 'day');
              step = -1;
            } else if (e.key === 'ArrowRight') {
              date = add(currentDay, 1, 'day');
            } else if (e.key === 'ArrowDown') {
              date = add(currentDay, 7, 'day');
            }
            await this.focusDay(e, date, step);
            return;
          }
        }
      }
    }
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
  static {
    n(this.prototype, "handleClick", [action]);
  }
  setup = modifier(() => {
    if (this.didSetup) {
      return;
    }
    this.didSetup = true;
    if (this.args.autofocus) {
      scheduleOnce('afterRender', this, this.initialFocus.bind(this));
    }
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    eager: false
  });
  initialFocus() {
    const activeDay = this.days.find(x => x.isSelected && !x.isDisabled);
    if (activeDay) {
      this.focusedId = activeDay.id;
    } else {
      const todayDay = this.days.find(x => x.isToday && !x.isDisabled);
      if (todayDay) {
        this.focusedId = todayDay.id ?? '';
      } else {
        const firstSelectableDay = this.days.find(x => !x.isDisabled);
        if (firstSelectableDay) {
          this.focusedId = firstSelectableDay.id ?? '';
        } else {
          this.focusedId = this.days.find(x => !x.isCurrentMonth)?.id ?? '';
        }
      }
    }
    focusDate(this.args.calendar.uniqueId, this.focusedId ?? '');
  }
  async focusDay(e, date, step = 0) {
    if (dayIsDisabled(date, this.args.calendar, this.args.minDate, this.args.maxDate, this.args.disabledDates)) {
      return;
    }
    if (this.args.calendar.actions.moveCenter && step !== 0) {
      await this.args.calendar.actions.moveCenter(step, 'month', this.args.calendar, e);
    }
    this.focusedId = formatDate(date, 'YYYY-MM-DD');
    if (step !== 0) {
      scheduleOnce('afterRender', this, focusDate, this.args.calendar.uniqueId, this.focusedId ?? '');
    } else {
      focusDate(this.args.calendar.uniqueId, this.focusedId ?? '');
    }
  }
  // Methods
  dayIsSelected(date, calendar = this.args.calendar) {
    return calendar.selected ? isSame(date, calendar.selected, 'day') : false;
  }
  _updateFocused(id) {
    this.focusedId = id ?? null;
  }
  static {
    setComponentTemplate(precompileTemplate("\n    {{!-- template-lint-disable no-invalid-interactive --}}\n    <div class=\"ember-power-calendar-days\" data-power-calendar-id={{or @calendar.calendarUniqueId @calendar.uniqueId}} role=\"grid\" aria-labelledby=\"ember-power-calendar-nav-title-{{@calendar.uniqueId}}\" {{on \"click\" this.handleClick}} {{this.setup}} ...attributes>\n      <div class=\"ember-power-calendar-row ember-power-calendar-weekdays\" role=\"row\">\n        {{#each this.weekdaysNames as |wdn|}}\n          <div class=\"ember-power-calendar-weekday\" role=\"columnheader\">{{wdn}}</div>\n        {{/each}}\n      </div>\n      <div class=\"ember-power-calendar-day-grid\" role=\"rowgroup\" {{on \"keydown\" this.handleKeyDown}}>\n        {{#each this.weeks key=\"id\" as |week|}}\n          <div class=\"ember-power-calendar-row ember-power-calendar-week\" role=\"row\" data-missing-days={{week.missingDays}}>\n            {{#each week.days key=\"id\" as |day|}}\n              <button type=\"button\" role=\"gridcell\" data-date=\"{{day.id}}\" class={{emberPowerCalendarDayClasses day @calendar this.weeks @dayClass}} {{on \"focus\" this.handleDayFocus}} {{on \"blur\" this.handleDayBlur}} disabled={{day.isDisabled}} tabindex={{if day.isFocused \"0\" \"-1\"}} aria-selected={{if day.isSelected \"true\"}}>\n                {{#if (has-block)}}\n                  {{yield day @calendar this.weeks}}\n                {{else}}\n                  {{day.number}}\n                {{/if}}\n              </button>\n            {{/each}}\n          </div>\n        {{/each}}\n      </div>\n    </div>\n  ", {
      strictMode: true,
      scope: () => ({
        or,
        on,
        emberPowerCalendarDayClasses
      })
    }), this);
  }
}

export { PowerCalendarDays as default };
//# sourceMappingURL=days.js.map
