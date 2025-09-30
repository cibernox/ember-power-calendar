import Component from '@glimmer/component';
import { type PowerCalendarDay } from '../../utils.ts';
import type { CalendarAPI } from '../power-calendar.ts';
import type PowerCalendarService from '../../services/power-calendar.ts';
import { type TWeekdayFormat, type Week } from '../../-private/days-utils.ts';
export interface PowerCalendarDaysArgs {
    calendar: CalendarAPI;
    dayClass?: string;
    disabledDates?: Array<Date | string>;
    maxDate?: Date;
    minDate?: Date;
    selected?: Date;
    showDaysAround?: boolean;
    startOfWeek?: string;
    center?: Date;
    weekdayFormat?: TWeekdayFormat;
    autofocus?: boolean;
    isDatePicker?: boolean;
}
export interface PowerCalendarDaysSignature {
    Element: HTMLElement;
    Args: PowerCalendarDaysArgs;
    Blocks: {
        default: [day: PowerCalendarDay, calendar: CalendarAPI, weeks: Week[]];
    };
}
export default class PowerCalendarDaysComponent extends Component<PowerCalendarDaysSignature> {
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
    dayIsSelected(date: Date, calendar?: CalendarAPI): boolean;
    _updateFocused(id?: string | null): void;
}
//# sourceMappingURL=days.d.ts.map