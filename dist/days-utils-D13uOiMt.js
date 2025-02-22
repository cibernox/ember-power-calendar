import { assert } from '@ember/debug';
import { localeStartOfWeek, startOf, startOfWeek, formatDate, normalizeCalendarDay, isSame, isBefore, isAfter, endOf, endOfWeek } from './utils.js';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function localeStartOfWeekOrFallback(startOfWeek, locale) {
  if (startOfWeek) {
    return parseInt(startOfWeek, 10);
  }
  return localeStartOfWeek(locale);
}
function weekdaysNames(localeStartOfWeek, weekdayFormat, weekdays, weekdaysMin, weekdaysShort) {
  let weekdaysNames;
  if (weekdayFormat === 'long') {
    weekdaysNames = weekdays;
  } else if (weekdayFormat === 'min') {
    weekdaysNames = weekdaysMin;
  } else {
    weekdaysNames = weekdaysShort;
  }
  return weekdaysNames.slice(localeStartOfWeek).concat(weekdaysNames.slice(0, localeStartOfWeek));
}
function firstDay(currentCenter, localeStartOfWeek) {
  const firstDay = startOf(currentCenter, 'month');
  return startOfWeek(firstDay, localeStartOfWeek);
}
function weeks(days, showDaysAround) {
  const weeks = [];
  let i = 0;
  while (days[i]) {
    let daysOfWeek = days.slice(i, i + 7);
    if (!showDaysAround) {
      daysOfWeek = daysOfWeek.filter(d => d.isCurrentMonth);
    }
    weeks.push({
      id: `week-of-${daysOfWeek[0]?.id}`,
      days: daysOfWeek,
      missingDays: 7 - daysOfWeek.length
    });
    i += 7;
  }
  return weeks;
}
function handleDayKeyDown(e, focusedId, days) {
  if (!focusedId) {
    return;
  }
  let day, index;
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
function focusDate(uniqueId, id) {
  const dayElement = document.querySelector(`[data-power-calendar-id="${uniqueId}"] [data-date="${id}"]`);
  if (dayElement) {
    dayElement.focus();
  }
}
function buildDay(date, today, calendar, focusedId, currentCenter, dayIsSelected, minDate, maxDate, disabledDates, dayIsDisabledExtended) {
  const id = formatDate(date, 'YYYY-MM-DD');
  let isDisabled = false;
  if (typeof dayIsDisabledExtended === 'function') {
    isDisabled = dayIsDisabledExtended(date, calendar, minDate, maxDate, disabledDates);
  } else {
    isDisabled = dayIsDisabled(date, calendar, minDate, maxDate, disabledDates);
  }
  return normalizeCalendarDay({
    id,
    number: date.getDate(),
    date: new Date(date),
    isDisabled: isDisabled,
    isFocused: focusedId === id,
    isCurrentMonth: isSame(date, currentCenter, 'month'),
    isToday: isSame(date, today, 'day'),
    isSelected: dayIsSelected(date, calendar)
  });
}
function dayIsDisabled(date, calendar, minDate, maxDate, disabledDates) {
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
    const disabledInRange = disabledDates.some(d => {
      const isSameDay = isSame(date, d, 'day');
      const isWeekDayIncludes = WEEK_DAYS.indexOf(d) !== -1 && formatDate(date, 'ddd') === d;
      return isSameDay || isWeekDayIncludes;
    });
    if (disabledInRange) {
      return true;
    }
  }
  return false;
}
function lastDay(localeStartOfWeek, currentCenter) {
  assert('The center of the calendar is an invalid date.', !isNaN(currentCenter.getTime()));
  const lastDay = endOf(currentCenter, 'month');
  return endOfWeek(lastDay, localeStartOfWeek);
}
function handleClick(e, days, calendar) {
  const dayEl = e.target?.closest('[data-date]');
  if (dayEl) {
    const dateStr = dayEl.dataset['date'];
    const day = days.find(d => d.id === dateStr);
    if (day) {
      if (calendar.actions.select) {
        calendar.actions.select(day, calendar, e);
      }
    }
  }
}

export { lastDay as a, buildDay as b, weeks as c, focusDate as d, handleClick as e, firstDay as f, dayIsDisabled as g, handleDayKeyDown as h, localeStartOfWeekOrFallback as l, weekdaysNames as w };
//# sourceMappingURL=days-utils-D13uOiMt.js.map
