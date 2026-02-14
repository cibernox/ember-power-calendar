import Component from '@glimmer/component';
import { type TaskInstance } from 'ember-concurrency';
import { type PowerCalendarMultipleDaysSignature } from './power-calendar-multiple/days';
import { type PowerCalendarMultipleNavSignature } from './power-calendar-multiple/nav';
import { type NormalizeMultipleActionValue, type PowerCalendarDay, type NormalizeCalendarValue } from '../utils.ts';
import type { PowerCalendarAPI, PowerCalendarArgs, SelectedDays, TPowerCalendarMoveCenterUnit } from './power-calendar.ts';
import type Owner from '@ember/owner';
import type { ComponentLike } from '@glint/template';
import type PowerCalendarService from '../services/power-calendar.ts';
export interface PowerCalendarMultipleActions {
    changeCenter?: (newCenter: Date, calendar: PowerCalendarMultipleAPI, event: MouseEvent) => TaskInstance<void>;
    moveCenter?: (step: number, unit: TPowerCalendarMoveCenterUnit, calendar: PowerCalendarMultipleAPI, event: MouseEvent | KeyboardEvent) => Promise<void>;
    select?: (day: PowerCalendarDay | PowerCalendarDay[], calendar: PowerCalendarMultipleAPI, event: MouseEvent) => void;
}
export interface PowerCalendarMultipleAPI extends Omit<PowerCalendarAPI, 'type' | 'selected' | 'actions'> {
    type: 'multiple';
    selected?: Date[];
    actions: PowerCalendarMultipleActions;
}
export type TPowerCalendarMultipleOnSelect = (day: NormalizeMultipleActionValue, calendar: PowerCalendarMultipleAPI, event?: Event) => void;
interface PowerCalendarMultipleArgs extends Omit<PowerCalendarArgs, 'navComponent' | 'daysComponent' | 'selected' | 'onSelect' | 'onCenterChange' | 'onInit'> {
    navComponent?: ComponentLike<PowerCalendarMultipleNavSignature>;
    daysComponent?: ComponentLike<PowerCalendarMultipleDaysSignature>;
    selected?: Date[];
    onSelect?: TPowerCalendarMultipleOnSelect;
    onInit?: (calendar: PowerCalendarMultipleAPI) => void;
    onCenterChange?: (newCenter: NormalizeCalendarValue, calendar: PowerCalendarMultipleAPI, event: Event) => Promise<void> | void;
}
interface PowerCalendarMultipleDefaultBlock extends PowerCalendarMultipleAPI {
    Nav: ComponentLike<{
        Args: Omit<PowerCalendarMultipleNavSignature['Args'], 'calendar'>;
        Blocks: PowerCalendarMultipleNavSignature['Blocks'];
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
export default class PowerCalendarMultiple extends Component<PowerCalendarMultipleSignature> {
    powerCalendar: PowerCalendarService;
    center: null;
    _selected?: SelectedDays;
    constructor(owner: Owner, args: PowerCalendarMultipleArgs);
    willDestroy(): void;
    get publicActions(): PowerCalendarMultipleActions;
    get selected(): Date[] | undefined;
    set selected(v: SelectedDays);
    get currentCenter(): Date;
    get publicAPI(): PowerCalendarMultipleAPI;
    get tagWithDefault(): keyof HTMLElementTagNameMap;
    get navComponent(): ComponentLike<PowerCalendarMultipleNavSignature>;
    get daysComponent(): ComponentLike<PowerCalendarMultipleDaysSignature>;
    calendarAPI(publicAPI: PowerCalendarMultipleAPI, components: {
        Nav: ComponentLike<PowerCalendarMultipleNavSignature>;
        Days: ComponentLike<PowerCalendarMultipleDaysSignature>;
    }): PowerCalendarMultipleDefaultBlock;
    changeCenterTask: import("ember-concurrency").TaskForAsyncTaskFunction<unknown, (newCenter: Date, calendar: PowerCalendarMultipleAPI, e: Event) => Promise<void>>;
    select(dayOrDays: PowerCalendarDay | PowerCalendarDay[], calendar: PowerCalendarMultipleAPI, e?: Event): void;
    _buildCollection(days: PowerCalendarDay[]): NormalizeMultipleActionValue;
    registerCalendar(): void;
    unregisterCalendar(): void;
}
export {};
//# sourceMappingURL=power-calendar-multiple.d.ts.map