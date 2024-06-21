import type { PowerCalendarAPI } from '../components/power-calendar.ts';
import type { Week } from '../-private/days-utils.ts';
import type { PowerCalendarDay } from '../utils.ts';
export declare function emberPowerCalendarDayClasses([day, calendar, weeks, dayClass]: [
    PowerCalendarDay,
    PowerCalendarAPI,
    Week[],
    (string | ((day: PowerCalendarDay, calendar: PowerCalendarAPI, weeks: Week[]) => string))
]): string;
declare const _default: import("@ember/component/helper").FunctionBasedHelper<{
    Args: {
        Positional: [PowerCalendarDay, PowerCalendarAPI, Week[], string | ((day: PowerCalendarDay, calendar: PowerCalendarAPI, weeks: Week[]) => string)];
        Named: import("@ember/component/helper").EmptyObject;
    };
    Return: string;
}>;
export default _default;
//# sourceMappingURL=ember-power-calendar-day-classes.d.ts.map