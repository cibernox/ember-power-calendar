import Component from '@glimmer/component';
import { type PowerCalendarDay } from '../../utils.ts';
import { type TWeekdayFormat, type Week } from '../../-private/days-utils.ts';
import type { CalendarAPI } from '../power-calendar.ts';
import type PowerCalendarService from '../../services/power-calendar.ts';
import type { PowerCalendarDaysArgs, PowerCalendarDaysSignature } from '../power-calendar/days.ts';
interface PowerCalendarMultipleDaysArgs extends Omit<PowerCalendarDaysArgs, 'selected'> {
    selected?: Date[];
    maxLength?: number;
}
interface PowerCalendarMultipleDaysSignature extends Omit<PowerCalendarDaysSignature, 'Args'> {
    Args: PowerCalendarMultipleDaysArgs;
}
export default class PowerCalendarMultipleDaysComponent extends Component<PowerCalendarMultipleDaysSignature> {
    powerCalendar: PowerCalendarService;
    focusedId: string | null;
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
    handleKeyDown(e: KeyboardEvent): void;
    handleClick(e: MouseEvent): void;
    dayIsSelected(date: Date, calendar?: CalendarAPI): boolean;
    _updateFocused(id?: string | null): void;
    dayIsDisabled(date: Date, calendarApi: CalendarAPI, minDate?: Date, maxDate?: Date, disabledDates?: Array<Date | string>): boolean;
}
export {};
//# sourceMappingURL=days.d.ts.map