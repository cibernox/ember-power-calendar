import type { TaskForAsyncTaskFunction } from 'ember-concurrency';
import type {
  CalendarAPI,
  CalendarDay,
  PowerCalendarActions,
  TPowerCalendarOnSelect,
} from '../components/power-calendar';
import { add } from '../utils.ts';
import type { TPowerCalendarRangeOnSelect } from '../components/power-calendar-range';
import type { TPowerCalendarMultipleOnSelect } from '../components/power-calendar-multiple.ts';

export function publicActionsObject(
  onSelect:
    | TPowerCalendarOnSelect
    | TPowerCalendarRangeOnSelect
    | TPowerCalendarMultipleOnSelect
    | undefined,
  select: (day: CalendarDay, calendar: CalendarAPI, e: MouseEvent) => void,
  onCenterChange:
    | ((newCenter: any, calendar: CalendarAPI, event: MouseEvent) => void)
    | undefined,
  changeCenterTask: TaskForAsyncTaskFunction<
    unknown,
    (newCenter: Date, calendar: CalendarAPI, e: MouseEvent) => Promise<void>
  >,
  currentCenter: Date,
): PowerCalendarActions {
  const actions: PowerCalendarActions = {};
  if (onSelect) {
    actions.select = (...args) => select(...args);
  }
  if (onCenterChange) {
    const changeCenter = (
      newCenter: Date,
      calendar: CalendarAPI,
      e: MouseEvent,
    ) => {
      return changeCenterTask.perform(newCenter, calendar, e);
    };
    actions.changeCenter = changeCenter;
    actions.moveCenter = (step, unit, calendar, e) => {
      const newCenter = add(currentCenter, step, unit);
      return changeCenter(newCenter, calendar, e);
    };
  }

  return actions;
}
