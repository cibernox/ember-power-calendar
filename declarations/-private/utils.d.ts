import type { TaskForAsyncTaskFunction } from 'ember-concurrency';
import type { CalendarAPI, CalendarDay, PowerCalendarActions, TPowerCalendarOnSelect } from '../components/power-calendar';
import { type NormalizeCalendarValue } from '../utils.ts';
import type { TPowerCalendarRangeOnSelect } from '../components/power-calendar-range';
import type { TPowerCalendarMultipleOnSelect } from '../components/power-calendar-multiple.ts';
export declare function publicActionsObject(onSelect: TPowerCalendarOnSelect | TPowerCalendarRangeOnSelect | TPowerCalendarMultipleOnSelect | undefined, select: (day: CalendarDay, calendar: CalendarAPI, e: MouseEvent) => void, onCenterChange: ((newCenter: NormalizeCalendarValue, calendar: CalendarAPI, event: MouseEvent) => Promise<void> | void) | undefined, changeCenterTask: TaskForAsyncTaskFunction<unknown, (newCenter: Date, calendar: CalendarAPI, e: MouseEvent | KeyboardEvent) => Promise<void>>, currentCenter: Date): PowerCalendarActions;
//# sourceMappingURL=utils.d.ts.map