import Component from '@glimmer/component';
import type {
  CalendarAPI,
  TPowerCalendarMoveCenterUnit,
} from '../power-calendar.ts';

export interface PowerCalendarNavSignature {
  Args: {
    calendar: CalendarAPI;
    format: string;
    unit: TPowerCalendarMoveCenterUnit;
  };
  Blocks: {
    default: [calendar: CalendarAPI];
  };
}

export default class PowerCalendarNavComponent extends Component<PowerCalendarNavSignature> {
  get unit(): TPowerCalendarMoveCenterUnit {
    return this.args.unit || 'month';
  }

  get format() {
    return this.args.format || 'MMMM YYYY';
  }
}
