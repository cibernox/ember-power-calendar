// Easily allow apps, which are not yet using strict mode templates, to consume your Glint types, by importing this file.
// Add all your components, helpers and modifiers to the template registry here, so apps don't have to do this.
// See https://typed-ember.gitbook.io/glint/environments/ember/authoring-addons

import type PowerCalendarComponent from './components/power-calendar.ts';
import type PowerCalendarRangeComponent from './components/power-calendar-range.ts';
import type PowerCalendarMultipleComponent from './components/power-calendar-multiple.ts';

export default interface EmberStyleModifierRegistry {
  PowerCalendar: typeof PowerCalendarComponent;
  PowerCalendarRange: typeof PowerCalendarRangeComponent;
  PowerCalendarMultiple: typeof PowerCalendarMultipleComponent;
}
