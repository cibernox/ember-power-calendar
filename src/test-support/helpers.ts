import { assert } from '@ember/debug';
import { click, settled } from '@ember/test-helpers';
import { formatDate } from '../utils.ts';
import type PowerCalendarMultiple from '../components/power-calendar-multiple.ts';
import type PowerCalendar from '../components/power-calendar.ts';
import type PowerCalendarRange from '../components/power-calendar-range.ts';

export default {};

export * from '../utils.ts';

function findCalendarElement(
  selector: string,
  rootElement?: RootElement,
): Element | null | undefined {
  let target = document.querySelector(selector);
  if (rootElement) {
    target = rootElement.querySelector(selector);
  }

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

function findCalendarGuid(
  selector: string,
  rootElement?: RootElement,
): string | undefined {
  const maybeCalendar = findCalendarElement(selector, rootElement);
  if (!maybeCalendar) {
    return;
  }
  if (maybeCalendar.classList.contains('ember-power-calendar')) {
    return maybeCalendar.id;
  } else {
    return (maybeCalendar as HTMLElement).dataset['powerCalendarId'];
  }
}

function findComponentInstance(
  selector: string,
  rootElement?: RootElement,
): PowerCalendar | PowerCalendarMultiple | PowerCalendarRange {
  const calendarGuid = findCalendarGuid(selector, rootElement);
  assert(
    `Could not find a calendar using selector: "${selector}"`,
    calendarGuid,
  );
  // @ts-expect-error Property '__powerCalendars'
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return window.__powerCalendars?.[calendarGuid];
}

export async function calendarCenter(
  selector: string,
  newCenter: Date,
  rootElement?: RootElement,
): Promise<void> {
  assert(
    '`calendarCenter` expect a Date object as second argument',
    newCenter instanceof Date,
  );
  const calendarComponent = findComponentInstance(
    selector,
    rootElement,
  ) as PowerCalendar;
  const onCenterChange = calendarComponent.args.onCenterChange;
  assert(
    "You cannot call `calendarCenter` on a component that doesn't has an `@onCenterChange` action",
    !!onCenterChange,
  );
  const publicAPI = calendarComponent.publicAPI;
  await publicAPI.actions.changeCenter!(newCenter, publicAPI, {} as MouseEvent);
  return settled();
}

export async function calendarSelect(
  selector: string,
  selected: Date,
  rootElement?: RootElement,
): Promise<void> {
  assert('`calendarSelect` expect a Date object as second argument', selected);
  const calendarElement = findCalendarElement(selector, rootElement);
  const daySelector = `${selector} [data-date="${formatDate(
    selected,
    'YYYY-MM-DD',
  )}"]`;
  let dayElement = calendarElement?.querySelector(daySelector);
  if (!dayElement) {
    await calendarCenter(selector, selected, rootElement);
  }
  dayElement = calendarElement?.querySelector(daySelector);
  if (!dayElement) {
    return;
  }
  return click(dayElement);
}
