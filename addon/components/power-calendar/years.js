import Component from '@ember/component';
import { computed } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject } from '@ember/service';
import { assert } from '@ember/debug';
import layout from '../../templates/components/power-calendar/years';
import fallbackIfUndefined from '../../utils/computed-fallback-if-undefined';

import {
  add,
  formatDate,
  isAfter,
  isBefore,
  isSame,
  normalizeCalendarDay
} from 'ember-power-calendar-utils';

export default Component.extend({
  classNames: ['ember-power-calendar-months'],
  firstQuarter: fallbackIfUndefined(1),
  focusedId: null,
  layout,
  yearFormat: fallbackIfUndefined('YYYY'),
  powerCalendarService: inject('power-calendar'),
  showQuarterLabels: true,
  rowWidth: 3,
  attributeBindings: [
    'data-power-calendar-id'
  ],


  // CPs
  years: computed('calendar', 'focusedId', 'minDate', 'maxDate', 'disabledDates.[]', 'maxLength', function() {
    let thisYear = this.get('powerCalendarService').getDate();
    let calendar = this.get('calendar');
    let lastYear = this.lastYear(calendar);
    let year = this.firstYear(calendar);

    let years = [];
    while (isBefore(year, lastYear) || isSame(year, lastYear)) {
      years.push(this.buildYear(year, thisYear, calendar));
      year = add(year, 1, 'year');
    }

    assert('there should be 12 years', years.length === 12);
    return years;
  }),

  // Actions
  actions: {
    onFocusMonth(month) {
      scheduleOnce('actions', this, this._updateFocused, month.id);
    },

    onBlurMonth() {
      scheduleOnce('actions', this, this._updateFocused, null);
    },

    onKeyDown(calendar, e) {
      let focusedId = this.get('focusedId');
      let rowWidth = this.get('rowWidth');
      if (focusedId) {

        // find the year
        let years = this.get('years');
        let year, idx;

        for (idx = 0; idx < years.length; idx++) {
          if (years[idx].id === focusedId) break;
        }

        // up arrow
        if (e.keyCode === 38) {
          e.preventDefault();
          let newYearIdx = Math.max(idx - rowWidth, 0);
          for (let i = newYearIdx; i <= idx; i++) {
            year = years[i];

            if (!year.isDisabled) break;
          }
        
        // down arrow
        } else if (e.keyCode === 40) {
          e.preventDefault();
          let newYearIdx = Math.min(idx + rowWidth, years.length - 1);
          for (let i = newYearIdx; i >= idx; i--) {
            year = years[i];

            if (!year.isDisabled) break;
          }

        // left arrow
        } else if (e.keyCode === 37) {
          year = years[Math.max(idx - 1, 0)];
          if (year.isDisabled) return;

        // right arrow
        } else if (e.keyCode === 39) {
          year = years[Math.min(idx + 1, years.length - 1)];
          if (year.isDisabled) return;

        } else {
          return;
        }
        this.set('focusedId', year.id);
        scheduleOnce('afterRender', this, '_focusDate', year.id);
      }
    }
  },

  // Methods
  buildYear(date, thisYear, calendar) {
    let id = formatDate(date, 'YYYY')

    return normalizeCalendarDay({
      date: new Date(date),
      id,
      isCurrentYear: isSame(date, thisYear, 'year'),
      isCurrentDecade: this._getDecade(date) !== this._getDecade(calendar.center),
      isDisabled: this.yearIsDisabled(date),
      isFocused: this.get('focusedId') === id,
      isSelected: this.yearIsSelected(date, calendar),
      period: 'year',
    });
  },

  buildonSelectValue(month) {
    return month;
  },

  yearIsSelected(date, calendar = this.get('calendar')) {
    return calendar.selected ? isSame(date, calendar.selected, 'year') : false;
  },

  yearIsDisabled(date) {
    let isDisabled = !this.get('onSelect');
    if (isDisabled) {
      return true;
    }

    let minDate = this.get('minDate');
    if (minDate && isBefore(date, minDate) && !isSame(date, minDate, 'year')) {
      return true;
    }

    let maxDate = this.get('maxDate');
    if (maxDate && isAfter(date, maxDate) && !isSame(date, maxDate, 'year')) {
      return true;
    }

    let disabledDates = this.get('disabledDates');

    if (disabledDates) {
      let disabledInRange = disabledDates.some((d) => {
        return isSame(date, d, 'year');
      });

      if (disabledInRange) {
        return true;
      }
    }

    return false;
  },

  firstYear(calendar) {
    assert("The center of the calendar is an invalid date.", !isNaN(calendar.center.getTime()));

    return new Date(this._getDecade(calendar.center) - 1, 0);
  },

  lastYear(calendar) {
    assert("The center of the calendar is an invalid date.", !isNaN(calendar.center.getTime()));

    return new Date(this._getDecade(calendar.center) + 10, 0);
  },

  _getDecade(date) {
    const year = date.getFullYear();
    return year - year % 10;
  },

  _updateFocused(id) {
    this.set('focusedId', id);
  },

  _focusDate(id) {
    let monthElement = this.element.querySelector(`[data-date="${id}"]`);
    if (monthElement) {
      monthElement.focus();
    }
  }
});
