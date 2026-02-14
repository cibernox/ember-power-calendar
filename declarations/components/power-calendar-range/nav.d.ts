import Component from '@glimmer/component';
import type { TPowerCalendarMoveCenterUnit } from '../power-calendar.ts';
import type { PowerCalendarRangeAPI } from '../power-calendar-range.ts';
export interface PowerCalendarRangeNavSignature {
    Args: {
        calendar: PowerCalendarRangeAPI;
        format?: string;
        unit?: TPowerCalendarMoveCenterUnit;
        isDatePicker?: boolean;
        ariaLabelPreviousMonth?: string;
        ariaLabelNextMonth?: string;
    };
    Blocks: {
        default: [calendar: PowerCalendarRangeAPI];
    };
}
export default class PowerCalendarRangeNav extends Component<PowerCalendarRangeNavSignature> {
    get unit(): TPowerCalendarMoveCenterUnit;
    get format(): string;
}
//# sourceMappingURL=nav.d.ts.map