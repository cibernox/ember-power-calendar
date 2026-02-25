import PowerCalendarDays from 'ember-power-calendar/components/power-calendar/days';
import {
  add,
  isBefore,
  startOf,
  endOf,
  weekday,
  formatDate,
} from 'ember-power-calendar/utils';

export default class DaysGridWithoutMonOrWed extends PowerCalendarDays {
  get customDays() {
    const now = new Date();
    let day = startOf(startOf(now, 'month'), 'isoWeek');
    const lastDay = endOf(endOf(now, 'month'), 'isoWeek');
    const days = [];
    while (isBefore(day, lastDay)) {
      if (weekday(day) !== 1 && weekday(day) !== 3) {
        // Skip Mon/Wed
        const copy = new Date(day);
        const isCurrentMonth = copy.getMonth() === now.getMonth();
        days.push({ date: copy, isCurrentMonth });
      }
      day = add(day, 1, 'day');
    }
    return days;
  }

  get weeksWithoutMondaysOrWednesday() {
    const weeks = [];
    let i = 0;
    while (this.customDays[i]) {
      weeks.push({ days: this.days.slice(i, i + 5) });
      i += 5;
    }
    return weeks;
  }

  <template>
    <div class="ember-power-calendar-row ember-power-calendar-weekdays">
      <div class="ember-power-calendar-weekday">Tue</div>
      <div class="ember-power-calendar-weekday">Thu</div>
      <div class="ember-power-calendar-weekday">Fri</div>
      <div class="ember-power-calendar-weekday">Sat</div>
      <div class="ember-power-calendar-weekday">Sun</div>
    </div>
    <div class="ember-power-calendar-day-grid">
      {{#each this.weeksWithoutMondaysOrWednesday as |week|}}
        <div class="ember-power-calendar-row ember-power-calendar-week">
          {{#each week.days as |day|}}
            <div
              class="ember-power-calendar-day
                {{if
                  day.isCurrentMonth
                  'ember-power-calendar-day--current-month'
                }}"
            >
              {{formatDate day.date "D"}}
            </div>
          {{/each}}
        </div>
      {{/each}}
    </div>
  </template>
}
