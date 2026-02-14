import Component from '@glimmer/component';
import type { PowerCalendarAPI, TPowerCalendarMoveCenterUnit } from '../power-calendar.ts';
export interface PowerCalendarNavSignature {
    Args: {
        calendar: PowerCalendarAPI;
        format?: string;
        unit?: TPowerCalendarMoveCenterUnit;
        isDatePicker?: boolean;
        ariaLabelPreviousMonth?: string;
        ariaLabelNextMonth?: string;
    };
    Blocks: {
        default: [calendar: PowerCalendarAPI];
    };
}
export default class PowerCalendarNav extends Component<PowerCalendarNavSignature> {
    get unit(): TPowerCalendarMoveCenterUnit;
    get format(): string;
}
//# sourceMappingURL=nav.d.ts.map