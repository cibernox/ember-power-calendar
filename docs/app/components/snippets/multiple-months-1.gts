import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { add, type NormalizeCalendarValue, type NormalizeRangeActionValue, type SelectedPowerCalendarRange } from 'ember-power-calendar/utils';
import PowerCalendarRange from 'ember-power-calendar/components/power-calendar-range';
import powerCalendarFormatDate from 'ember-power-calendar/helpers/power-calendar-format-date';

export default class extends Component {
  @tracked center: Date | undefined = new Date('2016-05-17');
  @tracked selected: SelectedPowerCalendarRange | undefined = undefined;

  get nextMonthsCenter(): Date {
    if (!this.center) {
      return new Date();
    }

    return add(this.center, 1, 'month');
  }

  @action
  onCenterChange(selected: NormalizeCalendarValue) {
    this.center = selected.date;
  }

  @action
  onSelect(selected: NormalizeRangeActionValue) {
    this.selected = selected.date;
  }

  <template>
    <PowerCalendarRange
      class="multiple-month-power-calendar-horizontal"
      @center={{this.center}}
      @selected={{this.selected}}
      @onCenterChange={{this.onCenterChange}}
      @onSelect={{this.onSelect}}
      as |calendar|
    >
      <calendar.Nav>
        <div class="month-name">
          {{powerCalendarFormatDate
            calendar.center
            "MMMM"
            locale=calendar.locale
          }}
        </div>
        <div class="month-name">
          {{powerCalendarFormatDate
            this.nextMonthsCenter
            "MMMM"
            locale=calendar.locale
          }}
        </div>
      </calendar.Nav>

      <div class="months-container">
        <calendar.Days @showDaysAround={{false}} />
        <calendar.Days
          @center={{this.nextMonthsCenter}}
          @showDaysAround={{false}}
        />
      </div>
    </PowerCalendarRange>
  </template>
}
