import Component from '@glimmer/component';
import { type PowerCalendarDay, type TWeekdayFormat } from '../../utils.ts';
import type { PowerCalendarMultipleAPI } from '../power-calendar-multiple.ts';
import { type Week } from '../../-private/days-utils.ts';
import { type TDayClass } from '../../helpers/ember-power-calendar-day-classes.ts';
import type PowerCalendarService from '../../services/power-calendar.ts';
import type { PowerCalendarDaysArgs } from '../power-calendar/days.ts';
interface PowerCalendarMultipleDaysArgs extends Omit<PowerCalendarDaysArgs, 'calendar' | 'dayClass' | 'selected'> {
    calendar: PowerCalendarMultipleAPI;
    dayClass?: TDayClass<PowerCalendarMultipleAPI>;
    selected?: Date[];
    maxLength?: number;
}
export interface PowerCalendarMultipleDaysSignature {
    Element: HTMLElement;
    Args: PowerCalendarMultipleDaysArgs;
    Blocks: {
        default: [
            day: PowerCalendarDay,
            calendar: PowerCalendarMultipleAPI,
            weeks: Week[]
        ];
    };
}
export default class PowerCalendarMultipleDays extends Component<PowerCalendarMultipleDaysSignature> {
    powerCalendar: PowerCalendarService;
    focusedId: string | null;
    didSetup: boolean;
    get weekdayFormat(): TWeekdayFormat;
    get showDaysAround(): boolean;
    get weekdaysMin(): string[];
    get weekdaysShort(): string[];
    get weekdays(): string[];
    get localeStartOfWeek(): number;
    get weekdaysNames(): string[];
    get days(): PowerCalendarDay[];
    get weeks(): Week[];
    get currentCenter(): Date;
    get maxLength(): number;
    handleDayFocus(e: FocusEvent): void;
    handleDayBlur(): void;
    handleKeyDown(e: KeyboardEvent): Promise<void>;
    handleClick(e: MouseEvent): void;
    setup: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    initialFocus(): void;
    focusDay(e: MouseEvent | KeyboardEvent, date: Date, step?: number): Promise<void>;
    dayIsSelected(date: Date, calendar?: PowerCalendarMultipleAPI): boolean;
    _updateFocused(id?: string | null): void;
    dayIsDisabled(date: Date, calendarApi: PowerCalendarMultipleAPI, minDate?: Date, maxDate?: Date, disabledDates?: Array<Date | string>): boolean;
}
export {};
//# sourceMappingURL=days.d.ts.map