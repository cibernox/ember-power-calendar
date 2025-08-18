import Component from '@glimmer/component';
import { type TaskInstance } from 'ember-concurrency';
import type { ComponentLike } from '@glint/template';
import { type NormalizeCalendarValue, type PowerCalendarDay, type SelectedPowerCalendarRange } from '../utils.ts';
import PowerCalendarNavComponent, { type PowerCalendarNavSignature } from './power-calendar/nav.ts';
import PowerCalendarDaysComponent, { type PowerCalendarDaysSignature } from './power-calendar/days.ts';
import type Owner from '@ember/owner';
import type PowerCalendarService from '../services/power-calendar.ts';
import type { PowerCalendarRangeAPI, PowerCalendarRangeDay } from './power-calendar-range.ts';
import type { PowerCalendarMultipleAPI } from './power-calendar-multiple.ts';
export type TCalendarType = 'multiple' | 'range' | 'single';
export type TPowerCalendarMoveCenterUnit = 'year' | 'month';
export type SelectedDays = SelectedPowerCalendarRange | Date | Date[] | undefined;
export type CalendarAPI = PowerCalendarAPI | PowerCalendarMultipleAPI | PowerCalendarRangeAPI;
export interface PowerCalendarAPI {
    uniqueId: string;
    calendarUniqueId?: string;
    selected?: SelectedDays;
    loading: boolean;
    center: Date;
    locale: string;
    type: TCalendarType;
    actions: PowerCalendarActions;
}
export interface PowerCalendarActions {
    changeCenter?: (newCenter: Date, calendar: CalendarAPI, event: MouseEvent) => TaskInstance<void>;
    moveCenter?: (step: number, unit: TPowerCalendarMoveCenterUnit, calendar: PowerCalendarAPI, event: MouseEvent | KeyboardEvent) => Promise<void>;
    select?: (day: CalendarDay, calendar: CalendarAPI, event: MouseEvent) => void;
}
export type TPowerCalendarOnSelect = (day: CalendarDay, calendar: CalendarAPI, event: MouseEvent) => void;
export interface PowerCalendarArgs {
    daysComponent?: string | ComponentLike<PowerCalendarDaysSignature>;
    locale?: string;
    navComponent?: string | ComponentLike<PowerCalendarNavSignature>;
    onCenterChange?: (newCenter: NormalizeCalendarValue, calendar: PowerCalendarAPI, event: MouseEvent) => Promise<void> | void;
    onInit?: (calendar: PowerCalendarAPI) => void;
    onSelect?: TPowerCalendarOnSelect;
    selected?: SelectedDays;
    center?: Date;
    tag?: string;
    ariaLabel?: boolean;
    ariaLabeledBy?: boolean;
    isDatePicker?: boolean;
    autofocus?: boolean;
}
export interface PowerCalendarDefaultBlock extends PowerCalendarAPI {
    Nav: ComponentLike<{
        Args: Omit<PowerCalendarNavSignature['Args'], 'calendar'>;
        Blocks: PowerCalendarNavSignature['Blocks'];
    }>;
    Days: ComponentLike<{
        Element: PowerCalendarDaysSignature['Element'];
        Args: Omit<PowerCalendarDaysSignature['Args'], 'calendar'>;
        Blocks: PowerCalendarDaysSignature['Blocks'];
    }>;
}
export type CalendarDay = PowerCalendarDay | PowerCalendarRangeDay | PowerCalendarDay[];
export interface PowerCalendarSignature {
    Element: HTMLElement;
    Args: PowerCalendarArgs;
    Blocks: {
        default: [PowerCalendarDefaultBlock];
    };
}
export default class PowerCalendarComponent extends Component<PowerCalendarSignature> {
    powerCalendar: PowerCalendarService;
    center: null;
    _calendarType: TCalendarType;
    _selected?: SelectedDays;
    navComponent: typeof PowerCalendarNavComponent;
    daysComponent: typeof PowerCalendarDaysComponent;
    constructor(owner: Owner, args: PowerCalendarArgs);
    willDestroy(): void;
    get publicActions(): PowerCalendarActions;
    get selected(): SelectedDays;
    set selected(v: SelectedDays);
    get currentCenter(): Date;
    get publicAPI(): PowerCalendarAPI;
    get _publicAPI(): PowerCalendarAPI;
    get tagWithDefault(): string;
    changeCenterTask: import("ember-concurrency").TaskForAsyncTaskFunction<unknown, (newCenter: Date, calendar: PowerCalendarAPI, e: MouseEvent) => Promise<void>>;
    select(day: CalendarDay, calendar: PowerCalendarAPI, e: MouseEvent): void;
    registerCalendar(): void;
    unregisterCalendar(): void;
}
//# sourceMappingURL=power-calendar.d.ts.map