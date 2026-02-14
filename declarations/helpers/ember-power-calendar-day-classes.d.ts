import type { Week } from '../-private/days-utils.ts';
import type { BaseCalendarAPI, PowerCalendarDay } from '../utils.ts';
export type TDayClass<T extends BaseCalendarAPI<T>> = string | ((day: PowerCalendarDay, calendar: T, weeks: Week[]) => string) | undefined;
export default function emberPowerCalendarDayClasses<T extends BaseCalendarAPI<T>>(day: PowerCalendarDay, calendar: T, weeks: Week[], dayClass: TDayClass<T>): string;
//# sourceMappingURL=ember-power-calendar-day-classes.d.ts.map