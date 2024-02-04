import { run } from '@ember/runloop';
import { assert } from '@ember/debug';
import { click, settled, find } from '@ember/test-helpers';
import { formatDate } from '../utils.ts';
import type PowerCalendarMultipleComponent from '../components/power-calendar-multiple.ts';
import type PowerCalendarComponent from '../components/power-calendar.ts';
import type PowerCalendarRangeComponent from '../components/power-calendar-range.ts';

export default {};

export * from '../utils.ts';

function findCalendarElement(selector: string): Element | null | undefined {
  let target = find(selector);

  if (target) {
    if (target.classList.contains('ember-power-calendar')) {
      return target;
    } else {
      return (
        target.querySelector('.ember-power-calendar') ||
        target.querySelector('[data-power-calendar-id]')
      );
    }
  }
}

function findCalendarGuid(selector: string): string | undefined {
  let maybeCalendar = findCalendarElement(selector);
  if (!maybeCalendar) {
    return;
  }
  if (maybeCalendar.classList.contains('ember-power-calendar')) {
    return maybeCalendar.id;
  } else {
    return (maybeCalendar as HTMLElement).dataset['dataPowerCalendarId'];
  }
}

function findComponentInstance(selector: string): PowerCalendarComponent | PowerCalendarMultipleComponent | PowerCalendarRangeComponent {
  let calendarGuid = findCalendarGuid(selector);
  assert(
    `Could not find a calendar using selector: "${selector}"`,
    calendarGuid,
  );
  // @ts-expect-error Property '__powerCalendars'
  return window.__powerCalendars[calendarGuid];
}

export async function calendarCenter(selector: string, newCenter: Date): Promise<void> {
  assert(
    '`calendarCenter` expect a Date object as second argument',
    newCenter instanceof Date,
  );
  let calendarComponent = findComponentInstance(selector);
  let onCenterChange = calendarComponent.args.onCenterChange;
  assert(
    "You cannot call `calendarCenter` on a component that doesn't has an `@onCenterChange` action",
    !!onCenterChange,
  );
  let publicAPI = calendarComponent.publicAPI;
  run(() => publicAPI.actions.changeCenter!(newCenter, publicAPI, {} as MouseEvent));
  return settled();
}

export async function calendarSelect(selector: string, selected: Date): Promise<void> {
  assert('`calendarSelect` expect a Date object as second argument', selected);
  let calendarElement = findCalendarElement(selector);
  let daySelector = `${selector} [data-date="${formatDate(
    selected,
    'YYYY-MM-DD',
  )}"]`;
  let dayElement = calendarElement?.querySelector(daySelector);
  if (!dayElement) {
    await calendarCenter(selector, selected);
  }
  return click(daySelector);
}
