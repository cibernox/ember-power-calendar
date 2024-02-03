import { assert } from '@ember/debug';
import type {
  CalendarAPI,
  PowerCalendarDay,
} from '../components/power-calendar.ts';
import {
  WEEK_DAYS,
  type TWeekdayFormat,
  type Week,
} from '../components/power-calendar/days.ts';
import {
  endOf,
  endOfWeek,
  formatDate,
  isAfter,
  isBefore,
  isSame,
  localeStartOfWeek,
  normalizeCalendarDay,
  startOf,
  startOfWeek,
} from '../utils.ts';

export function localeStartOfWeekOrFallback(
  startOfWeek: string | undefined,
  locale: string,
): number {
  if (startOfWeek) {
    return parseInt(startOfWeek, 10);
  }
  return localeStartOfWeek(locale);
}

export function weekdaysNames(
  localeStartOfWeek: number,
  weekdayFormat: TWeekdayFormat,
  weekdays: string[],
  weekdaysMin: string[],
  weekdaysShort: string[],
): string[] {
  let weekdaysNames;
  if (weekdayFormat === 'long') {
    weekdaysNames = weekdays;
  } else if (weekdayFormat === 'min') {
    weekdaysNames = weekdaysMin;
  } else {
    weekdaysNames = weekdaysShort;
  }
  return weekdaysNames
    .slice(localeStartOfWeek)
    .concat(weekdaysNames.slice(0, localeStartOfWeek));
}

export function firstDay(currentCenter: Date, localeStartOfWeek: number): Date {
  const firstDay = startOf(currentCenter, 'month');
  return startOfWeek(firstDay, localeStartOfWeek);
}

export function weeks(
  days: PowerCalendarDay[],
  showDaysAround: boolean,
): Week[] {
  const weeks: Week[] = [];
  let i = 0;
  while (days[i]) {
    let daysOfWeek = days.slice(i, i + 7);
    if (!showDaysAround) {
      daysOfWeek = daysOfWeek.filter((d) => d.isCurrentMonth);
    }
    weeks.push({
      id: `week-of-${daysOfWeek[0]?.id}`,
      days: daysOfWeek,
      missingDays: 7 - daysOfWeek.length,
    });
    i += 7;
  }
  return weeks;
}

export function handleDayKeyDown(
  e: KeyboardEvent,
  focusedId: string | null,
  days: PowerCalendarDay[],
): PowerCalendarDay | undefined {
  if (!focusedId) {
    return;
  }
  let day, index: number | undefined;
  for (let i = 0; i < days.length; i++) {
    if (days[i]?.id === focusedId) {
      index = i;
      break;
    }
  }

  if (!index) {
    return;
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    const newIndex = Math.max(index - 7, 0);
    day = days[newIndex];
    if (day?.isDisabled) {
      for (let i = newIndex + 1; i <= index; i++) {
        day = days[i];
        if (!day?.isDisabled) {
          break;
        }
      }
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    const newIndex = Math.min(index + 7, days.length - 1);
    day = days[newIndex];
    if (day?.isDisabled) {
      for (let i = newIndex - 1; i >= index; i--) {
        day = days[i];
        if (!day?.isDisabled) {
          break;
        }
      }
    }
  } else if (e.key === 'ArrowLeft') {
    day = days[Math.max(index - 1, 0)];
    if (day?.isDisabled) {
      return;
    }
  } else if (e.key === 'ArrowRight') {
    day = days[Math.min(index + 1, days.length - 1)];
    if (day?.isDisabled) {
      return;
    }
  } else {
    return;
  }

  return day;
}

export function focusDate(uniqueId: string, id: string): void {
  const dayElement: HTMLElement | null = document.querySelector(
    `[data-power-calendar-id="${uniqueId}"] [data-date="${id}"]`,
  );
  if (dayElement) {
    dayElement.focus();
  }
}

export function buildDay(
  date: Date,
  today: Date,
  calendar: CalendarAPI,
  focusedId: string | null,
  currentCenter: Date,
  dayIsSelected: (date: Date, calendar: CalendarAPI) => boolean,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Array<Date | string>,
  dayIsDisabledExtended?: (
    date: Date,
    calendar: CalendarAPI,
    minDate?: Date,
    maxDate?: Date,
    disabledDates?: Array<Date | string>,
  ) => boolean,
): PowerCalendarDay {
  const id = formatDate(date, 'YYYY-MM-DD');

  let isDisabled = false;
  if (typeof dayIsDisabledExtended === 'function') {
    isDisabled = dayIsDisabledExtended(
      date,
      calendar,
      minDate,
      maxDate,
      disabledDates,
    );
  } else {
    isDisabled = dayIsDisabled(date, calendar, minDate, maxDate, disabledDates);
  }

  return normalizeCalendarDay({
    id,
    number: date.getDate(),
    date: new Date(date),
    isDisabled: isDisabled,
    isFocused: focusedId === id,
    isCurrentMonth: date.getMonth() === currentCenter.getMonth(),
    isToday: isSame(date, today, 'day'),
    isSelected: dayIsSelected(date, calendar),
  } as PowerCalendarDay);
}

export function dayIsDisabled(
  date: Date,
  calendar: CalendarAPI,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Array<Date | string>,
): boolean {
  const isDisabled = !calendar.actions.select;
  if (isDisabled) {
    return true;
  }

  if (minDate && isBefore(date, startOf(minDate, 'day'))) {
    return true;
  }

  if (maxDate && isAfter(date, endOf(maxDate, 'day'))) {
    return true;
  }

  if (disabledDates) {
    const disabledInRange = disabledDates.some((d) => {
      const isSameDay = isSame(date, d as Date, 'day');
      const isWeekDayIncludes =
        WEEK_DAYS.indexOf(d as string) !== -1 && formatDate(date, 'ddd') === d;
      return isSameDay || isWeekDayIncludes;
    });

    if (disabledInRange) {
      return true;
    }
  }

  return false;
}

export function lastDay(localeStartOfWeek: number, currentCenter: Date): Date {
  assert(
    'The center of the calendar is an invalid date.',
    !isNaN(currentCenter.getTime()),
  );
  const lastDay = endOf(currentCenter, 'month');
  return endOfWeek(lastDay, localeStartOfWeek);
}

export function handleClick(
  e: MouseEvent,
  days: PowerCalendarDay[],
  calendar: CalendarAPI,
): void {
  const dayEl: HTMLElement | null | undefined = (
    e.target as HTMLElement | null
  )?.closest('[data-date]');
  if (dayEl) {
    const dateStr = dayEl.dataset['date'];
    const day = days.find((d) => d.id === dateStr);
    if (day) {
      if (calendar.actions.select) {
        calendar.actions.select(day, calendar, e);
      }
    }
  }
}
