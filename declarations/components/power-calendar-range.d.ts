import Component from '@glimmer/component';
import PowerCalendarRangeDaysComponent, { type PowerCalendarRangeDaysSignature } from './power-calendar-range/days.ts';
import PowerCalendarNavComponent, { type PowerCalendarNavSignature } from './power-calendar/nav.ts';
import { type NormalizeRangeActionValue, type PowerCalendarDay, type SelectedPowerCalendarRange } from '../utils.ts';
import type { PowerCalendarAPI, PowerCalendarArgs, TCalendarType, SelectedDays, PowerCalendarActions, CalendarDay, CalendarAPI } from './power-calendar.ts';
import type Owner from '@ember/owner';
import type { ComponentLike } from '@glint/template';
import type PowerCalendarService from '../services/power-calendar.ts';
export interface PowerCalendarRangeDay extends Omit<PowerCalendarDay, 'date'> {
    date: SelectedPowerCalendarRange;
}
export declare const DAY_IN_MS = 86400000;
export type TPowerCalendarRangeOnSelect = (day: NormalizeRangeActionValue, calendar: PowerCalendarRangeAPI, event: MouseEvent) => void;
interface PowerCalendarRangeArgs extends Omit<PowerCalendarArgs, 'selected' | 'onSelect'> {
    selected?: SelectedPowerCalendarRange;
    minRange?: number;
    maxRange?: number;
    proximitySelection?: boolean;
    onSelect?: TPowerCalendarRangeOnSelect;
}
export interface PowerCalendarRangeDefaultBlock extends PowerCalendarRangeAPI {
    Nav: ComponentLike<{
        Args: Omit<PowerCalendarNavSignature['Args'], 'calendar'>;
        Blocks: PowerCalendarNavSignature['Blocks'];
    }>;
    Days: ComponentLike<{
        Element: PowerCalendarRangeDaysSignature['Element'];
        Args: Omit<PowerCalendarRangeDaysSignature['Args'], 'calendar'>;
        Blocks: PowerCalendarRangeDaysSignature['Blocks'];
    }>;
}
interface PowerCalendarRangeSignature {
    Element: HTMLElement;
    Args: PowerCalendarRangeArgs;
    Blocks: {
        default: [PowerCalendarRangeDefaultBlock];
    };
}
export interface PowerCalendarRangeAPI extends Omit<PowerCalendarAPI, 'selected'> {
    selected?: SelectedPowerCalendarRange;
    minRange?: number | null;
    maxRange?: number | null;
}
export default class PowerCalendarRangeComponent extends Component<PowerCalendarRangeSignature> {
    powerCalendar: PowerCalendarService;
    center: null;
    _calendarType: TCalendarType;
    _selected?: SelectedDays;
    navComponent: typeof PowerCalendarNavComponent;
    daysComponent: typeof PowerCalendarRangeDaysComponent;
    constructor(owner: Owner, args: PowerCalendarRangeArgs);
    willDestroy(): void;
    get publicActions(): PowerCalendarActions;
    get selected(): SelectedPowerCalendarRange;
    set selected(v: SelectedPowerCalendarRange);
    get currentCenter(): Date;
    get publicAPI(): PowerCalendarRangeAPI;
    get tagWithDefault(): string;
    get proximitySelection(): boolean;
    get minRange(): number | null;
    get maxRange(): number | null;
    changeCenterTask: import("ember-concurrency").TaskForAsyncTaskFunction<unknown, (newCenter: Date, calendar: PowerCalendarRangeAPI, e: MouseEvent) => Promise<void>>;
    select(day: CalendarDay, calendar: CalendarAPI, e: MouseEvent): void;
    _formatRange(v: number | undefined): number | null | undefined;
    _buildRange(day: {
        date: Date;
    }): NormalizeRangeActionValue;
    _buildRangeByProximity(day: {
        date: Date;
    }, start?: Date | null, end?: Date | null): NormalizeRangeActionValue;
    _buildDefaultRange(day: {
        date: Date;
    }, start?: Date | null, end?: Date | null): NormalizeRangeActionValue;
    registerCalendar(): void;
    unregisterCalendar(): void;
}
export {};
//# sourceMappingURL=power-calendar-range.d.ts.map