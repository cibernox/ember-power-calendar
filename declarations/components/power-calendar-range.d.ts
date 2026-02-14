import Component from '@glimmer/component';
import { type TaskInstance } from 'ember-concurrency';
import { type PowerCalendarRangeDaysSignature } from './power-calendar-range/days';
import { type PowerCalendarRangeNavSignature } from './power-calendar-range/nav';
import { type NormalizeRangeActionValue, type PowerCalendarDay, type SelectedPowerCalendarRange, type NormalizeCalendarValue } from '../utils.ts';
import type { PowerCalendarAPI, PowerCalendarArgs, SelectedDays, TPowerCalendarMoveCenterUnit } from './power-calendar.ts';
import type Owner from '@ember/owner';
import type { ComponentLike } from '@glint/template';
import type PowerCalendarService from '../services/power-calendar.ts';
export interface PowerCalendarRangeDay extends Omit<PowerCalendarDay, 'date'> {
    date: SelectedPowerCalendarRange | Date;
}
export declare const DAY_IN_MS = 86400000;
export type TPowerCalendarRangeOnSelect = (day: NormalizeRangeActionValue, calendar: PowerCalendarRangeAPI, event?: Event) => void;
interface PowerCalendarRangeArgs extends Omit<PowerCalendarArgs, 'daysComponent' | 'navComponent' | 'selected' | 'onSelect' | 'onCenterChange' | 'onInit'> {
    navComponent?: ComponentLike<PowerCalendarRangeNavSignature>;
    daysComponent?: ComponentLike<PowerCalendarRangeDaysSignature>;
    selected?: SelectedPowerCalendarRange;
    minRange?: number;
    maxRange?: number;
    proximitySelection?: boolean;
    onSelect?: TPowerCalendarRangeOnSelect;
    onInit?: (calendar: PowerCalendarRangeAPI) => void;
    onCenterChange?: (newCenter: NormalizeCalendarValue, calendar: PowerCalendarRangeAPI, event: Event) => Promise<void> | void;
}
export interface PowerCalendarRangeDefaultBlock extends PowerCalendarRangeAPI {
    Nav: ComponentLike<{
        Args: Omit<PowerCalendarRangeNavSignature['Args'], 'calendar'>;
        Blocks: PowerCalendarRangeNavSignature['Blocks'];
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
export interface PowerCalendarRangeActions {
    changeCenter?: (newCenter: Date, calendar: PowerCalendarRangeAPI, event: Event) => TaskInstance<void>;
    moveCenter?: (step: number, unit: TPowerCalendarMoveCenterUnit, calendar: PowerCalendarRangeAPI, event: Event | KeyboardEvent) => Promise<void>;
    select?: (day: PowerCalendarRangeDay, calendar: PowerCalendarRangeAPI, event?: Event) => void;
}
export interface PowerCalendarRangeAPI extends Omit<PowerCalendarAPI, 'type' | 'selected' | 'actions'> {
    type: 'range';
    selected?: SelectedPowerCalendarRange;
    minRange?: number | null;
    maxRange?: number | null;
    actions: PowerCalendarRangeActions;
}
export default class PowerCalendarRange extends Component<PowerCalendarRangeSignature> {
    powerCalendar: PowerCalendarService;
    center: null;
    _selected?: SelectedDays;
    constructor(owner: Owner, args: PowerCalendarRangeArgs);
    willDestroy(): void;
    get publicActions(): PowerCalendarRangeActions;
    get selected(): SelectedPowerCalendarRange;
    set selected(v: SelectedPowerCalendarRange);
    get currentCenter(): Date;
    get publicAPI(): PowerCalendarRangeAPI;
    get tagWithDefault(): keyof HTMLElementTagNameMap;
    get proximitySelection(): boolean;
    get minRange(): number | null;
    get maxRange(): number | null;
    get navComponent(): ComponentLike<PowerCalendarRangeNavSignature>;
    get daysComponent(): ComponentLike<PowerCalendarRangeDaysSignature>;
    calendarAPI(publicAPI: PowerCalendarRangeAPI, components: {
        Nav: ComponentLike<PowerCalendarRangeNavSignature>;
        Days: ComponentLike<PowerCalendarRangeDaysSignature>;
    }): PowerCalendarRangeDefaultBlock;
    changeCenterTask: import("ember-concurrency").TaskForAsyncTaskFunction<unknown, (newCenter: Date, calendar: PowerCalendarRangeAPI, e: Event) => Promise<void>>;
    select(day: PowerCalendarRangeDay, calendar: PowerCalendarRangeAPI, e?: Event): void;
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