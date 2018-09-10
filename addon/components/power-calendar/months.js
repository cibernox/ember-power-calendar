import Component from '@ember/component';
import { computed } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject } from '@ember/service';
import { assert } from '@ember/debug';
import layout from '../../templates/components/power-calendar/months';
import fallbackIfUndefined from '../../utils/computed-fallback-if-undefined';

import {
  add,
  endOf,
  formatDate,
  isAfter,
  isBefore,
  isSame,
  normalizeCalendarDay,
  startOf
} from 'ember-power-calendar-utils';

export default Component.extend({
  attributeBindings: ['data-power-calendar-id'],
  classNames: ['ember-power-calendar-months'],

  firstQuarter: fallbackIfUndefined(1),
  focusedId: null,
  layout,
  monthFormat: fallbackIfUndefined('MMM'),
  period: 'month',
  powerCalendarService: inject('power-calendar'),
  rowWidth: 3,
  showQuarterLabels: true,


  // CPs
  'data-power-calendar-id': computed.oneWay('calendar.uniqueId'),

  quarters: computed('calendar', 'focusedId', 'minDate', 'maxDate', 'disabledDates.[]', 'maxLength', 'firstQuarter', function() {
    let thisMonth = this.get('powerCalendarService').getDate();
    let calendar = this.get('calendar');
    let lastMonth = this.lastMonth(calendar);
    let month = this.firstMonth(calendar);
    let rowWidth = this.rowWidth;

    let months = [];
    while (isBefore(month, lastMonth) || isSame(month, lastMonth)) {
      months.push(this.buildPeriod(month, thisMonth, calendar));
      month = add(month, 1, this.get('period'));
    }
    
    assert('there should be 12 months in every year', months.length === 12);

    const rows = Math.ceil(months.length / rowWidth);
    const quartersArray = [...Array(rows).keys()].map(q => months.slice(rowWidth*q, rowWidth*(q + 1)));
    const quartersObjects = quartersArray.map((months, idx) => this.buildQuarter(months, idx, calendar));

    return quartersObjects;
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

        // find the month
        let quarters = this.get('quarters');
        let month, qIdx, mIdx;

        for (qIdx = 0; qIdx < quarters.length; qIdx++) {
          let done = false;
          for(mIdx = 0; mIdx < quarters[qIdx].months.length; mIdx++) {
            if (quarters[qIdx].months[mIdx].id === focusedId) {
              done = true;
              break;
            }
          }
          if (done) break;
        }

        // up arrow
        if (e.keyCode === 38) {
          e.preventDefault();
          let newQuarterIdx = Math.max(qIdx - 1, 0);
          for (let i = rowWidth*newQuarterIdx + mIdx; i <= rowWidth*qIdx + mIdx; i++) {
            month = quarters[Math.floor(i/rowWidth)].months[i%rowWidth];

            if (!month.isDisabled) break;
          }
        
        // down arrow
        } else if (e.keyCode === 40) {
          e.preventDefault();
          let newQuarterIdx = Math.min(qIdx + 1, quarters.length - 1);
          for (let i = rowWidth*newQuarterIdx + mIdx; i >= rowWidth*qIdx + mIdx; i--) {
            month = quarters[Math.floor(i/rowWidth)].months[i%rowWidth];

            if (!month.isDisabled) break;
          }

        // left arrow
        } else if (e.keyCode === 37) {
          month = quarters[qIdx].months[Math.max(mIdx - 1, 0)];
          if (month.isDisabled) {
            return;
          }

        // right arrow
        } else if (e.keyCode === 39) {
          month = quarters[qIdx].months[Math.min(mIdx + 1, rowWidth - 1)];
          if (month.isDisabled) {
            return;
          }
        } else {
          return;
        }
        this.set('focusedId', month.id);
        scheduleOnce('afterRender', this, '_focusDate', month.id);
      }
    }
  },

  // Methods
  buildPeriod(date, thisMonth, calendar) {
    const id = formatDate(date, 'YYYY-MM');
    const period = this.get('period');

    return normalizeCalendarDay({
      date: new Date(date),
      id,
      isCurrentMonth: isSame(date, thisMonth, period),
      isDisabled: this.isDisabled(date),
      isFocused: this.get('focusedId') === id,
      isSelected: this.isSelected(date, calendar),
      period: period,
    });
  },

  buildQuarter(months, idx, calendar) {
    return {
      id: `${months[0].date.getFullYear()}-${this._renderQuarter(idx)}`,
      label: this._renderQuarter(idx),
      isSelected: this.quarterIsSelected(months, calendar),
      months,
      period: 'quarter',
      date: months[0].date
    };
  },

  quarterIsSelected(months, calendar) {
    return months.some(m => this.isSelected(m.date, calendar));
  },

  buildonSelectValue(month) {
    return month;
  },

  isSelected(date, calendar = this.get('calendar')) {
    return calendar.selected ? isSame(date, calendar.selected, this.get('period')) : false;
  },

  isDisabled(date) {
    const isDisabled = !this.get('onSelect');
    const period = this.get('period');

    if (isDisabled) {
      return true;
    }

    let minDate = this.get('minDate');
    if (minDate && isBefore(date, minDate) && !isSame(date, minDate, period)) {
      return true;
    }

    let maxDate = this.get('maxDate');
    if (maxDate && isAfter(date, maxDate) && !isSame(date, maxDate, period)) {
      return true;
    }

    let disabledDates = this.get('disabledDates');

    if (disabledDates) {
      let disabledInRange = disabledDates.some((d) => {
        let isSameMonth = isSame(date, d, period);
        return isSameMonth;
      });

      if (disabledInRange) {
        return true;
      }
    }

    return false;
  },

  firstMonth(calendar) {
    assert("The center of the calendar is an invalid date.", !isNaN(calendar.center.getTime()));

    return startOf(calendar.center, 'year');
  },

  lastMonth(calendar) {
    assert("The center of the calendar is an invalid date.", !isNaN(calendar.center.getTime()));

    return startOf(endOf(calendar.center, 'year'), this.get('period'));
  },

  _renderQuarter(quarterIdx) {
    const firstQuarter = this.get('firstQuarter');
    assert('firstQuarter must be between 1 and 4', firstQuarter >= 1 && firstQuarter <= 4);

    const firstQuarterIdx = firstQuarter - 1;
    return `Q${(quarterIdx + firstQuarterIdx) % 4 + 1}`
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
