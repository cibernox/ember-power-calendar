import { layout, tagName } from "@ember-decorators/component";
import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';
import templateLayout from '../../templates/components/power-calendar/days';
import {
  add,
  endOf,
  endOfWeek,
  formatDate,
  getWeekdays,
  getWeekdaysMin,
  getWeekdaysShort,
  isAfter,
  isBefore,
  isSame,
  localeStartOfWeek,
  normalizeCalendarDay,
  normalizeDate,
  startOf,
  startOfWeek,
  withLocale,
} from 'ember-power-calendar-utils';

const WEEK_DAYS = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun'
];

export default @layout(templateLayout) @tagName('') class extends Component {
  focusedId = undefined
  showDaysAround = true
  weekdayFormat = 'short' // "min" | "short" | "long"
  @service('power-calendar') powerCalendarService

  // CPs
  @computed('calendar.locale')
  get weekdaysMin() {
    return withLocale(this.calendar.locale, getWeekdaysMin);
  }

  @computed('calendar.locale')
  get weekdaysShort() {
    return withLocale(this.calendar.locale, getWeekdaysShort);
  }

  @computed('calendar.locale')
  get weekdays() {
    return withLocale(this.calendar.locale, getWeekdays);
  }

  @computed('weekdaysShort', 'startOfWeek')
  get localeStartOfWeek() {
    let forcedStartOfWeek = this.startOfWeek;
    if (forcedStartOfWeek) {
      return parseInt(forcedStartOfWeek, 10);
    }
    return localeStartOfWeek(this.calendar.locale);
  }

  @computed('localeStartOfWeek', 'weekdayFormat', 'calendar.locale')
  get weekdaysNames() {
    let { localeStartOfWeek, weekdayFormat } = this;
    let format = `weekdays${weekdayFormat === 'long' ? '' : (weekdayFormat === 'min' ? 'Min' : 'Short')}`;
    let weekdaysNames = this[format];
    return weekdaysNames.slice(localeStartOfWeek).concat(weekdaysNames.slice(0, localeStartOfWeek));
  }

  @computed('calendar', 'focusedId', 'localeStartOfWeek', 'minDate', 'maxDate', 'disabledDates.[]', 'maxLength', 'currentCenter')
  get days() {
    let today = this.powerCalendarService.getDate();
    let lastDay = this.lastDay();
    let day = this.firstDay();
    let days = [];
    while (isBefore(day, lastDay)) {
      days.push(this.buildDay(day, today, this.calendar));
      day = add(day, 1, "day");
    }
    return days;
  }

  @computed('showDaysAround', 'days')
  get weeks() {
    let { showDaysAround, days } = this;
    let weeks = [];
    let i = 0;
    while (days[i]) {
      let daysOfWeek = days.slice(i, i + 7);
      if (!showDaysAround) {
        daysOfWeek = daysOfWeek.filter((d) => d.isCurrentMonth);
      }
      weeks.push({
        id: `week-of-${daysOfWeek[0].id}`,
        days: daysOfWeek,
        missingDays: 7 - daysOfWeek.length
      });
      i += 7;
    }
    return weeks;
  }

  @computed('center', 'calendar.center')
  get currentCenter() {
    let center = this.center;
    if (!center) {
      center = this.selected || this.calendar.center;
    }
    return normalizeDate(center);
  }

  // Actions
  @action
  handleDayFocus(e) {
    scheduleOnce('actions', this, this._updateFocused, e.target.dataset.date);
  }

  @action
  handleDayBlur() {
    scheduleOnce('actions', this, this._updateFocused, null);
  }

  @action
  handleKeyDown(e) {
    let { focusedId } = this;
    if (focusedId) {
      let days = this.days;
      let day, index;
      for (let i = 0; i < days.length; i++) {
        if (days[i].id === focusedId) {
          index = i;
          break;
        }
      }
      if (e.keyCode === 38) {
        e.preventDefault();
        let newIndex = Math.max(index - 7, 0);
        day = days[newIndex];
        if (day.isDisabled) {
          for (let i = newIndex + 1; i <= index; i++) {
            day = days[i];
            if (!day.isDisabled) {
              break;
            }
          }
        }
      } else if (e.keyCode === 40) {
        e.preventDefault();
        let newIndex = Math.min(index + 7, days.length - 1);
        day = days[newIndex];
        if (day.isDisabled) {
          for (let i = newIndex - 1; i >= index; i--) {
            day = days[i];
            if (!day.isDisabled) {
              break;
            }
          }
        }
      } else if (e.keyCode === 37) {
        day = days[Math.max(index - 1, 0)];
        if (day.isDisabled) {
          return;
        }
      } else if (e.keyCode === 39) {
        day = days[Math.min(index + 1, days.length - 1)];
        if (day.isDisabled) {
          return;
        }
      } else {
        return;
      }
      this.set('focusedId', day.id);
      scheduleOnce('afterRender', this, '_focusDate', day.id);
    }
  }

  // Methods
  buildDay(date, today, calendar) {
    let id = formatDate(date, 'YYYY-MM-DD')

    return normalizeCalendarDay({
      id,
      number: date.getDate(),
      date: new Date(date),
      isDisabled: this.dayIsDisabled(date),
      isFocused: this.focusedId === id,
      isCurrentMonth: date.getMonth() === this.currentCenter.getMonth(),
      isToday: isSame(date, today, 'day'),
      isSelected: this.dayIsSelected(date, calendar)
    });
  }

  buildonSelectValue(day) {
    return day;
  }

  dayIsSelected(date, calendar = this.calendar) {
    return calendar.selected ? isSame(date, calendar.selected, 'day') : false;
  }

  dayIsDisabled(date) {
    let isDisabled = !this.calendar.actions.select;
    if (isDisabled) {
      return true;
    }

    if (this.minDate && isBefore(date, startOf(this.minDate, 'day'))) {
      return true;
    }

    if (this.maxDate && isAfter(date, endOf(this.maxDate, 'day'))) {
      return true;
    }


    if (this.disabledDates) {
      let disabledInRange = this.disabledDates.some((d) => {
        let isSameDay = isSame(date, d, 'day');
        let isWeekDayIncludes = WEEK_DAYS.indexOf(d) !== -1 && formatDate(date, 'ddd') === d;
        return isSameDay || isWeekDayIncludes;
      });

      if (disabledInRange) {
        return true;
      }
    }

    return false;
  }

  firstDay() {
    let firstDay = startOf(this.currentCenter, 'month');
    return startOfWeek(firstDay, this.localeStartOfWeek);
  }

  lastDay() {
    let localeStartOfWeek = this.localeStartOfWeek;
    assert("The center of the calendar is an invalid date.", !isNaN(this.currentCenter.getTime()));
    let lastDay = endOf(this.currentCenter, 'month')
    return endOfWeek(lastDay, localeStartOfWeek);
  }

  _updateFocused(id) {
    this.set('focusedId', id);
  }

  _focusDate(id) {
    let dayElement = document.querySelector(`[data-power-calendar-id="${this.calendar.uniqueId}"] [data-date="${id}"]`);
    if (dayElement) {
      dayElement.focus();
    }
  }

  @action
  handleClick(e) {
    let dayEl = e.target.closest('[data-date]');
    if (dayEl) {
      let dateStr = dayEl.dataset.date;
      let day = this.days.find(d => d.id === dateStr);
      if (day) {
        if (this.calendar.actions.select) {
          this.calendar.actions.select(day, this.calendar, e);
        }
      }
    }
  }
}
