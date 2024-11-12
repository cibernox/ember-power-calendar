import Component from '@glimmer/component';
import type { CalendarAPI, TPowerCalendarMoveCenterUnit } from '../power-calendar.ts';
interface PowerCalendarNavSignature {
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
    get unit(): TPowerCalendarMoveCenterUnit;
    get format(): string;
}
export {};
//# sourceMappingURL=nav.d.ts.map