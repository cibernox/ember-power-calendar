import Component from '@glimmer/component';
import type { ComponentLike } from '@glint/template';
import { type NormalizeCalendarValue, type PowerCalendarDay, type SelectedPowerCalendarRange } from '../utils.ts';
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
    changeCenter?: (newCenter: Date, calendar: CalendarAPI, event: MouseEvent) => void;
    moveCenter?: (step: number, unit: TPowerCalendarMoveCenterUnit, calendar: PowerCalendarAPI, event: MouseEvent) => void;
    select?: (day: CalendarDay, calendar: CalendarAPI, event: MouseEvent) => void;
}
export type TPowerCalendarOnSelect = (day: CalendarDay, calendar: CalendarAPI, event: MouseEvent) => void;
export interface PowerCalendarArgs {
    daysComponent?: string | ComponentLike<any>;
    locale: string;
    navComponent?: string | ComponentLike<any>;
    onCenterChange?: (newCenter: NormalizeCalendarValue, calendar: PowerCalendarAPI, event: MouseEvent) => void;
    onInit?: (calendar: PowerCalendarAPI) => void;
    onSelect?: TPowerCalendarOnSelect;
    selected?: SelectedDays;
    center?: Date;
    tag?: string;
}
export interface PowerCalendarDefaultBlock extends PowerCalendarAPI {
    NavComponent: ComponentLike<any>;
    DaysComponent: ComponentLike<any>;
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
    navComponent: ComponentLike<any>;
    daysComponent: ComponentLike<any>;
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