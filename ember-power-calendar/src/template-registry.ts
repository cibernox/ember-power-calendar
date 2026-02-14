// Easily allow apps, which are not yet using strict mode templates, to consume your Glint types, by importing this file.
// Add all your components, helpers and modifiers to the template registry here, so apps don't have to do this.
// See https://typed-ember.gitbook.io/glint/environments/ember/authoring-addons

import type PowerCalendarComponent from './components/power-calendar.ts';
import type PowerCalendarRangeComponent from './components/power-calendar-range.ts';
import type PowerCalendarMultipleComponent from './components/power-calendar-multiple.ts';
import type PowerCalendarDaysComponent from './components/power-calendar/days.ts';
import type PowerCalendarNavComponent from './components/power-calendar/nav.ts';
import type PowerCalendarMultipleDaysComponent from './components/power-calendar-multiple/days.ts';
import type PowerCalendarMultipleNavComponent from './components/power-calendar-multiple/nav.ts';
import type PowerCalendarRangeDaysComponent from './components/power-calendar-range/days.ts';
import type PowerCalendarRangeNavComponent from './components/power-calendar-range/nav.ts';

export default interface Registry {
  PowerCalendar: typeof PowerCalendarComponent;
  PowerCalendarRange: typeof PowerCalendarRangeComponent;
  PowerCalendarMultiple: typeof PowerCalendarMultipleComponent;
  'PowerCalendar::Days': typeof PowerCalendarDaysComponent;
  'PowerCalendar::Nav': typeof PowerCalendarNavComponent;
  'PowerCalendarMultiple::Days': typeof PowerCalendarMultipleDaysComponent;
  'PowerCalendarMultiple::Nav': typeof PowerCalendarMultipleNavComponent;
  'PowerCalendarRange::Days': typeof PowerCalendarRangeDaysComponent;
  'PowerCalendarRange::Nav': typeof PowerCalendarRangeNavComponent;
}
