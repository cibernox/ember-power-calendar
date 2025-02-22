import Component from '@glimmer/component';
import PowerCalendarMultipleDaysComponent, { type PowerCalendarMultipleDaysSignature } from './power-calendar-multiple/days.ts';
import PowerCalendarNavComponent, { type PowerCalendarNavSignature } from './power-calendar/nav.ts';
import { type NormalizeMultipleActionValue, type PowerCalendarDay } from '../utils.ts';
import type { CalendarAPI, CalendarDay, PowerCalendarAPI, PowerCalendarActions, PowerCalendarArgs, SelectedDays, TCalendarType } from './power-calendar.ts';
import type Owner from '@ember/owner';
import type { ComponentLike } from '@glint/template';
import type PowerCalendarService from '../services/power-calendar.ts';
export interface PowerCalendarMultipleAPI extends Omit<PowerCalendarAPI, 'selected' | 'DaysComponent'> {
    selected?: Date[];
    DaysComponent: ComponentLike<PowerCalendarMultipleDaysSignature>;
}
export type TPowerCalendarMultipleOnSelect = (day: NormalizeMultipleActionValue, calendar: PowerCalendarMultipleAPI, event: MouseEvent) => void;
interface PowerCalendarMultipleArgs extends Omit<PowerCalendarArgs, 'selected' | 'daysComponent' | 'onSelect'> {
    selected?: Date[];
    daysComponent?: string | ComponentLike<PowerCalendarMultipleDaysSignature>;
    onSelect?: TPowerCalendarMultipleOnSelect;
}
interface PowerCalendarMultipleDefaultBlock extends PowerCalendarMultipleAPI {
    Nav: ComponentLike<{
        Args: Omit<PowerCalendarNavSignature['Args'], 'calendar'>;
        Blocks: PowerCalendarNavSignature['Blocks'];
    }>;
    Days: ComponentLike<{
        Element: PowerCalendarMultipleDaysSignature['Element'];
        Args: Omit<PowerCalendarMultipleDaysSignature['Args'], 'calendar'>;
        Blocks: PowerCalendarMultipleDaysSignature['Blocks'];
    }>;
}
interface PowerCalendarMultipleSignature {
    Element: HTMLElement;
    Args: PowerCalendarMultipleArgs;
    Blocks: {
        default: [PowerCalendarMultipleDefaultBlock];
    };
}
export default class PowerCalendarMultipleComponent extends Component<PowerCalendarMultipleSignature> {
    powerCalendar: PowerCalendarService;
    center: null;
    _calendarType: TCalendarType;
    _selected?: SelectedDays;
    navComponent: typeof PowerCalendarNavComponent;
    daysComponent: typeof PowerCalendarMultipleDaysComponent;
    constructor(owner: Owner, args: PowerCalendarMultipleArgs);
    willDestroy(): void;
    get publicActions(): PowerCalendarActions;
    get selected(): Date[] | undefined;
    set selected(v: SelectedDays);
    get currentCenter(): Date;
    get publicAPI(): PowerCalendarAPI;
    get tagWithDefault(): string;
    changeCenterTask: import("ember-concurrency").TaskForAsyncTaskFunction<unknown, (newCenter: Date, calendar: PowerCalendarAPI, e: MouseEvent) => Promise<void>>;
    select(dayOrDays: CalendarDay, calendar: CalendarAPI, e: MouseEvent): void;
    _buildCollection(days: PowerCalendarDay[]): NormalizeMultipleActionValue;
    registerCalendar(): void;
    unregisterCalendar(): void;
}
export {};
//# sourceMappingURL=power-calendar-multiple.d.ts.map