import type PowerCalendar from './components/power-calendar.ts';
import type PowerCalendarRange from './components/power-calendar-range.ts';
import type PowerCalendarMultiple from './components/power-calendar-multiple.ts';
import type PowerCalendarDays from './components/power-calendar/days.ts';
import type PowerCalendarNav from './components/power-calendar/nav.ts';
import type PowerCalendarMultipleDays from './components/power-calendar-multiple/days.ts';
import type PowerCalendarMultipleNav from './components/power-calendar-multiple/nav.ts';
import type PowerCalendarRangeDays from './components/power-calendar-range/days.ts';
import type PowerCalendarRangeNav from './components/power-calendar-range/nav.ts';
export default interface Registry {
    PowerCalendar: typeof PowerCalendar;
    PowerCalendarRange: typeof PowerCalendarRange;
    PowerCalendarMultiple: typeof PowerCalendarMultiple;
    'PowerCalendar::Days': typeof PowerCalendarDays;
    'PowerCalendar::Nav': typeof PowerCalendarNav;
    'PowerCalendarMultiple::Days': typeof PowerCalendarMultipleDays;
    'PowerCalendarMultiple::Nav': typeof PowerCalendarMultipleNav;
    'PowerCalendarRange::Days': typeof PowerCalendarRangeDays;
    'PowerCalendarRange::Nav': typeof PowerCalendarRangeNav;
}
//# sourceMappingURL=template-registry.d.ts.map