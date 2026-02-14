import Component from '@glimmer/component';
import { type TaskInstance } from 'ember-concurrency';
import { type NormalizeCalendarValue, type PowerCalendarDay, type SelectedPowerCalendarRange } from '../utils.ts';
import { type PowerCalendarNavSignature } from './power-calendar/nav';
import { type PowerCalendarDaysSignature } from './power-calendar/days';
import type { ComponentLike } from '@glint/template';
import type Owner from '@ember/owner';
import type PowerCalendarService from '../services/power-calendar.ts';
export type TCalendarType = 'multiple' | 'range' | 'single';
export type TPowerCalendarMoveCenterUnit = 'year' | 'month';
export type SelectedDays = SelectedPowerCalendarRange | Date | Date[] | undefined;
export interface PowerCalendarAPI {
    uniqueId: string;
    calendarUniqueId?: string;
    selected?: SelectedDays;
    loading: boolean;
    center: Date;
    locale: string;
    type: 'single';
    actions: PowerCalendarActions;
}
export interface PowerCalendarActions {
    changeCenter?: (newCenter: Date, calendar: PowerCalendarAPI, event: MouseEvent) => TaskInstance<void>;
    moveCenter?: (step: number, unit: TPowerCalendarMoveCenterUnit, calendar: PowerCalendarAPI, event: MouseEvent | KeyboardEvent) => Promise<void>;
    select?: (day: PowerCalendarDay, calendar: PowerCalendarAPI, event: MouseEvent) => void;
}
export type TPowerCalendarOnSelect = (day: PowerCalendarDay, calendar: PowerCalendarAPI, event?: Event) => void;
export interface PowerCalendarArgs {
    daysComponent?: ComponentLike<PowerCalendarDaysSignature>;
    locale?: string;
    navComponent?: ComponentLike<PowerCalendarNavSignature>;
    onCenterChange?: (newCenter: NormalizeCalendarValue, calendar: PowerCalendarAPI, event: Event) => Promise<void> | void;
    onInit?: (calendar: PowerCalendarAPI) => void;
    onSelect?: TPowerCalendarOnSelect;
    selected?: SelectedDays;
    center?: Date;
    tag?: keyof HTMLElementTagNameMap;
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
export interface PowerCalendarSignature {
    Element: HTMLElement;
    Args: PowerCalendarArgs;
    Blocks: {
        default: [PowerCalendarDefaultBlock];
    };
}
export default class PowerCalendar extends Component<PowerCalendarSignature> {
    powerCalendar: PowerCalendarService;
    center: null;
    _calendarType: TCalendarType;
    _selected?: SelectedDays;
    constructor(owner: Owner, args: PowerCalendarArgs);
    willDestroy(): void;
    get publicActions(): PowerCalendarActions;
    get selected(): SelectedDays;
    set selected(v: SelectedDays);
    get currentCenter(): Date;
    get publicAPI(): PowerCalendarAPI;
    get _publicAPI(): PowerCalendarAPI;
    get tagWithDefault(): keyof HTMLElementTagNameMap;
    get navComponent(): ComponentLike<PowerCalendarNavSignature>;
    get daysComponent(): ComponentLike<PowerCalendarDaysSignature>;
    calendarAPI(publicAPI: PowerCalendarAPI, components: {
        Nav: ComponentLike<PowerCalendarNavSignature>;
        Days: ComponentLike<PowerCalendarDaysSignature>;
    }): PowerCalendarDefaultBlock;
    changeCenterTask: import("ember-concurrency").TaskForAsyncTaskFunction<unknown, (newCenter: Date, calendar: PowerCalendarAPI, e: Event) => Promise<void>>;
    select(day: PowerCalendarDay, calendar: PowerCalendarAPI, e?: Event): void;
    registerCalendar(): void;
    unregisterCalendar(): void;
}
//# sourceMappingURL=power-calendar.d.ts.map