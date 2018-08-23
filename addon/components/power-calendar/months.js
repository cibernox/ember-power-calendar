import Component from '@ember/component';
import { computed } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject } from '@ember/service';
import { assert } from '@ember/debug';
import layout from '../../templates/components/power-calendar/months';
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
  layout,
  focusedId: null,
  showDaysAround: true,
  rowWidth: 3,
  classNames: ['ember-power-calendar-months'],
  powerCalendarService: inject('power-calendar'),
  attributeBindings: [
    'data-power-calendar-id'
  ],

  firstQuarter: 1,

  // CPs
  quarters: computed('calendar', 'focusedId', 'minDate', 'maxDate', 'disabledDates.[]', 'maxLength', function() {
    let thisMonth = this.get('powerCalendarService').getDate();
    let calendar = this.get('calendar');
    let lastMonth = this.lastMonth(calendar);
    let month = this.firstMonth(calendar);
    let rowWidth = this.rowWidth;

    let months = [];
    while (isBefore(month, lastMonth) || isSame(month, lastMonth)) {
      months.push(this.buildMonth(month, thisMonth, calendar));
      month = add(month, 1, 'month');
    }
    
    assert('there should be 12 months in every year', months.length === 12);

    const rows = Math.ceil(months.length / rowWidth);
    const quartersArray = [...Array(rows).keys()].map(q => months.slice(rowWidth*q, rowWidth*(q + 1)));
    const quartersObjects = quartersArray.map((months, idx) => ({
      id: `${months[0].date.getFullYear()}-${this._renderQuarter(idx)}`,
      label: this._renderQuarter(idx),
      months
    }));

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
        let months = this.get('months');
        let month, index;
        for (let i = 0; i < months.length; i++) {
          if (months[i].id === focusedId) {
            index = i;
            break;
          }
        }

        // up arrow
        if (e.keyCode === 38) {
          e.preventDefault();
          let newIndex = Math.max(index - rowWidth, 0);
          month = months[newIndex];
          if (month.isDisabled) {
            for (let i = newIndex + 1; i <= index; i++) {
              month = months[i];
              if (!month.isDisabled) {
                break;
              }
            }
          }
        
        // down arrow
        } else if (e.keyCode === 40) {
          e.preventDefault();
          let newIndex = Math.min(index + rowWidth, months.length - 1);
          month = months[newIndex];
          if (month.isDisabled) {
            for (let i = newIndex - 1; i >= index; i--) {
              month = months[i];
              if (!month.isDisabled) {
                break;
              }
            }
          }

        // left arrow
        } else if (e.keyCode === 37) {
          month = months[Math.max(index - 1, 0)];
          if (month.isDisabled) {
            return;
          }

        // right arrow
        } else if (e.keyCode === 39) {
          month = months[Math.min(index + 1, months.length - 1)];
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
  buildMonth(date, thisMonth, calendar) {
    let id = formatDate(date, 'YYYY-MM')

    return normalizeCalendarDay({
      date: new Date(date),
      id,
      isCurrentMonth: isSame(date, thisMonth, 'month'),
      isDisabled: this.monthIsDisabled(date),
      isFocused: this.get('focusedId') === id,
      isSelected: this.monthIsSelected(date, calendar)
    });
  },

  buildonSelectValue(month) {
    return month;
  },

  monthIsSelected(date, calendar = this.get('calendar')) {
    return calendar.selected ? isSame(date, calendar.selected, 'month') : false;
  },

  monthIsDisabled(date) {
    let isDisabled = !this.get('onSelect');
    if (isDisabled) {
      return true;
    }

    let minDate = this.get('minDate');
    if (minDate && isBefore(date, minDate)) {
      return true;
    }

    let maxDate = this.get('maxDate');
    if (maxDate && isAfter(date, maxDate)) {
      return true;
    }

    let disabledDates = this.get('disabledDates');

    if (disabledDates) {
      let disabledInRange = disabledDates.some((d) => {
        let isSameMonth = isSame(date, d, 'month');
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

    return startOf(endOf(calendar.center, 'year'), 'month');
  },

  _renderQuarter(quarterIdx) {
    const firstQuarter = this.get('firstQuarter');
    assert('firstQuarter must be between 1 and 4', firstQuarter >= 1 && firstQuarter <= 4);

    const firstQuarterIdx = firstQuarter - 1;
    return `Q${(4 + quarterIdx - firstQuarterIdx) % 4 + 1}`
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
