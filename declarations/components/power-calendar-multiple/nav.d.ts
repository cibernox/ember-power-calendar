import Component from '@glimmer/component';
import type { TPowerCalendarMoveCenterUnit } from '../power-calendar.ts';
import type { PowerCalendarMultipleAPI } from '../power-calendar-multiple.ts';
export interface PowerCalendarMultipleNavSignature {
    Args: {
        calendar: PowerCalendarMultipleAPI;
        format?: string;
        unit?: TPowerCalendarMoveCenterUnit;
        isDatePicker?: boolean;
        ariaLabelPreviousMonth?: string;
        ariaLabelNextMonth?: string;
    };
    Blocks: {
        default: [calendar: PowerCalendarMultipleAPI];
    };
}
export default class PowerCalendarMultipleNav extends Component<PowerCalendarMultipleNavSignature> {
    get unit(): TPowerCalendarMoveCenterUnit;
    get format(): string;
}
//# sourceMappingURL=nav.d.ts.map