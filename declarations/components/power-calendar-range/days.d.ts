import Component from '@glimmer/component';
import type { PowerCalendarDaysArgs, PowerCalendarDaysSignature } from '../power-calendar/days.ts';
import { type PowerCalendarDay } from '../../utils.ts';
import type { PowerCalendarRangeAPI } from '../power-calendar-range.ts';
import { type TWeekdayFormat, type Week } from '../../-private/days-utils.ts';
import type PowerCalendarService from '../../services/power-calendar.ts';
interface PowerCalendarMultipleDaysArgs extends Omit<PowerCalendarDaysArgs, 'calendar' | 'selected'> {
    calendar: PowerCalendarRangeAPI;
    selected?: {
        start: Date | null;
        end: Date | null;
    };
}
export interface PowerCalendarRangeDaysSignature extends Omit<PowerCalendarDaysSignature, 'Args'> {
    Args: PowerCalendarMultipleDaysArgs;
}
export default class PowerCalendarRangeDaysComponent extends Component<PowerCalendarRangeDaysSignature> {
    powerCalendar: PowerCalendarService;
    focusedId: string | null;
    didSetup: boolean;
    lastKeyDownWasSpace: boolean;
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
    handleClick(e: MouseEvent): Promise<void>;
    setup: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
    initialFocus(): void;
    focusDay(e: MouseEvent | KeyboardEvent, date: Date, step?: number): Promise<void>;
    buildDay(date: Date, today: Date, calendar: PowerCalendarRangeAPI): PowerCalendarDay;
    dayIsSelected(): boolean;
    _updateFocused(id?: string | null): void;
}
export {};
//# sourceMappingURL=days.d.ts.map