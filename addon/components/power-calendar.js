import layout from '../templates/components/power-calendar';
import Component from 'ember-component';
import computed from 'ember-computed';
import moment from 'moment';
import { scheduleOnce } from 'ember-runloop';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import { getProperties } from 'ember-metal/get';

export default Component.extend({
  layout,
  classNames: ['ember-power-calendar'],
  classNameBindings: ['changeMonthTask.isRunning:ember-power-calendar--loading'],
  displayedMonth: null,
  selected: null,
  focusedId: null,
  calendar: service(),

  // CPs
  publicAPI: computed(function() {
    return {
      actions: {
        decreaseMonth: () => this.get('changeMonthTask').perform(-1),
        increaseMonth: () => this.get('changeMonthTask').perform(1)
      }
    };
  }),

  dayNames: computed(function() {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }),

  currentlyDisplayedMonth: computed('displayedMonth', function() {
    let displayedMonth = this.get('displayedMonth');
    if (displayedMonth) {
      return moment(displayedMonth);
    }
    if (this.get('range')) {
      return moment(this.get('selected.start') || this.get('calendar').getDate());
    } else if (this.get('multiple')) {
      return moment((this.get('selected') || [])[0] || this.get('calendar').getDate());
    } else {
      return moment(this.get('selected') || this.get('calendar').getDate());
    }
  }),

  days: computed('currentlyDisplayedMonth', 'selected', 'focusedId', function() {
    let today = this.get('calendar').getDate();
    let displayedMonth = this.get('currentlyDisplayedMonth');
    let beginOfMonth = displayedMonth.clone().startOf('month');
    let startOfFirstWeek = beginOfMonth.clone().startOf('isoWeek');
    let endOfMonth = displayedMonth.clone().endOf('month');
    let endOfLastWeek = endOfMonth.clone().endOf('isoWeek');
    let currentMoment = startOfFirstWeek.clone();
    let focusedId = this.get('focusedId');
    let days = [];
    let isSelected;
    while (currentMoment.isBefore(endOfLastWeek)) {
      let id = currentMoment.format('YYYY-MM-DD');
      let momentDate = currentMoment.clone();
      let isRangeStart = false;
      let isRangeEnd = false;
      if (this.get('range')) {
        let { start, end } = getProperties(this.get('selected') || { start: null, end: null }, 'start', 'end');
        if (start && end) {
          isSelected = currentMoment.isBetween(start, end, 'day', '[]');
          isRangeStart = isSelected && currentMoment.isSame(start, 'day');
          isRangeEnd = !isRangeStart && currentMoment.isSame(end, 'day');
        } else {
          isRangeStart = isSelected = currentMoment.isSame(start, 'day');
        }
      } else if (this.get('multiple')) {
        let selected = this.get('selected') || [];
        isSelected =  selected.some((d) => currentMoment.isSame(d, 'day'));
      } else {
        let selected = this.get('selected');
        isSelected =  selected ? currentMoment.isSame(selected, 'day') : false;
      }

      days.push({
        id,
        number: currentMoment.date(),
        date: momentDate._d,
        moment: momentDate,
        isFocused: focusedId === id,
        isCurrentMonth: currentMoment.month() === displayedMonth.month(),
        isToday: currentMoment.isSame(today, 'day'),
        isSelected,
        isRangeStart,
        isRangeEnd
      });
      currentMoment.add(1, 'day');
    }
    return days;
  }),

  weeks: computed('days', function() {
    let days = this.get('days');
    let weeks = [];
    let i = 0;
    while (days[i]) {
      weeks.push({
        id: days[0].moment.format('YYYY-w'),
        days: days.slice(i, i + 7)
      });
      i += 7;
    }
    return weeks;
  }),

  // Actions
  actions: {
    clickDay(day, e) {
      let action = this.get('onChange');
      if (action) {
        if (this.get('range')) {
          let range = this._buildNewRange(day);
          action(range, e);
        } else if (this.get('multiple')) {
          let collection = this._buildNewCollection(day);
          action(collection, e);
        } else {
          action(day, e);
        }
      }
    },

    onFocusDay(day) {
      scheduleOnce('actions', this, this._updateFocused, day.id);
    },

    onBlurDay() {
      scheduleOnce('actions', this, this._updateFocused, null);
    },

    onKeyDown(e) {
      let focusedId = this.get('focusedId');
      if (focusedId) {
        let days = this.get('days');
        let day, index;
        for (let i = 0; i < days.length; i++) {
          if (days[i].id === focusedId) {
            index = i;
            break;
          }
        }
        if (e.keyCode === 38) {
          e.preventDefault();
          day = days[Math.max(index - 7, 0)];
        } else if (e.keyCode === 40) {
          e.preventDefault();
          day = days[Math.min(index + 7, days.length - 1)];
        } else if (e.keyCode === 37) {
          day = days[Math.max(index - 1, 0)];
        } else if (e.keyCode === 39) {
          day = days[Math.min(index + 1, days.length - 1)];
        } else {
          return;
        }
        this.set('focusedId', day.id);
        scheduleOnce('afterRender', this, '_focusDate', day.id);
      }
    }
  },

  // Tasks
  changeMonthTask: task(function* (step) {
    let displayedMonth = this.get('displayedMonth');
    let momentDate = moment(displayedMonth);
    let month = momentDate.clone().add(step, 'month');
    let newMonthValue = month._isAMomentObject ? month : month._d;
    yield this.get('onMonthChange')(newMonthValue);
  }),

  // Methods
  _updateFocused(id) {
    this.set('focusedId', id);
  },

  _focusDate(id) {
    let dayElement = this.element.querySelector(`[data-date="${id}"]`);
    if (dayElement) {
      dayElement.focus();
    }
  },

  _buildNewRange(day) {
    let selected = this.get('selected') || { start: null, end: null };
    let { start, end } = getProperties(selected, 'start', 'end');
    if (start && !end) {
      let startMoment = moment(start);
      if (startMoment.isAfter(day.moment)) {
        return {
          moment: { start: day.moment, end: startMoment },
          date: {  start: day.date, end: startMoment._d }
        };
      }  else {
        return {
          moment: { start: startMoment, end: day.moment },
          date: {  start: startMoment._d, end: day.date }
        };
      }
    } else {
      return {
        moment: { start: day.moment, end: null },
        date: {  start: day.date, end: null }
      };
    }
  },

  _buildNewCollection(day) {
    let selected = this.get('selected') || [];
    let moments = [];
    for (let i = 0; i < selected.length; i++) {
      if (day.moment.isSame(selected[i], 'day')) {
        selected.forEach((d, index) => {
          if (i !== index) {
            moments[moments.length] = moment(d);
          }
        });
        break;
      }
    }
    if (moments.length === 0) {
      moments = [...selected.map((d) => moment(d)), day.moment];
    }
    return {
      moment: moments,
      date: moments.map((m) => m._d)
    };
  }
});
