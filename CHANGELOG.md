## Master

## 0.7.2
- [FEATURE] Add `proximitySelection` to `power-calendar-range`. When true (default is false) the clicking on the calendar after a range has been selected doesn't start a new range, but moves the closest extreme of the current range, expanding or narrowing it.

## 0.7.1
- [INTERNAL] Update some testing deps

## 0.7.0
- [BREAKING] Require Ember >= 2.10

## 0.6.1
- [BUGFIX] Ensure `addon-test-support/` folder is not blacklisted in NPM

## 0.6.0
- [ENHANCEMENT] Now the `calendarCenter` and `calendarSelect` helpers are importable from `ember-power-calendar/test-support`
  and can be used in both integration and acceptance tests.
- [ENHANCEMENT] When the `moveCenter` action was called with a `null`/`undefined` value it could cause
  problems. Now doing that is perfectly legal and it will center the month in the current date.

## 0.5.0
- [ENHANCEMENT] Allow invocation without block. It renders both nav and days.
- [BUGFIX] Add `type="button"` to buttons in the nav so they are not implicitly considered
  type submit, leading to submitting the enclosing form.
- [INTERNAL] The addon is now jQuery free too.
- [BREAKING] Allow the `ember-power-calendar` SASS/LESS mixin to take a lot more variables
  to customize colors and more. Potentially breaking, but probably not for the big majority.

## 0.4.0
- [INTERNAL] Update to Babel 6

## 0.3.2
- [BUGFIX] Broken safari styles due to unnecesary flex position on days.

## 0.3.1
- [ENHANCEMENT] Added less support.

## 0.3.0
- [BREAKING] `onSelect` and `onCenterAction` now receive the publicAPI of the component
  as second argument and the event as third.

## 0.2.7
- [ENHANCEMENT] `data-ember-power-calendar-id` can be bound from the outside

## 0.2.6
- [ENHANCEMENT] Added an  `onInit` action that can be passed from the outside, and it called with the public API
  once.

## 0.2.5
- [BREAKING] Renamed `service:power-calendar-clock` to just `service:power-calendar`. This service
  wasn't public, so it's unlikely anyone will be affected.
- [ENHANCEMENT] Added `calendar.uniqueId` to the public API. The `{{cal.days}}` use it to display a `data-power-calendar-id`
  attribute that reference the original calendar.
- [ENHANCEMENT] The `calendarCenter` and `calendarSelect` test helpers now also work with tagless calendars,
  thanks to the enhancement above.

## 0.2.4
- [ENHANCEMENT] Add `maxLength` to the `{{cal.days}}` component of multiple selects. It determines the
  max number of day selections the user can make. Once that number is reached no more days can be selected,
  but those selected can be unselected.  Defaults to `Infinity` so there is no limit by default.

## 0.2.3
- [ENHANCEMENT] Allow to disable specific days passing `{{cal.days disabledDates=collection}}`.
  As usual the property can be a collection of Dates or Moments.

## 0.2.2
- [ENHANCEMENT] Improve default styles of calendar days.

## 0.2.1
- [ENHANCEMENT] Make Sass mixin more configurable, by accepting more variables. The basic usage remains
  the same, this is not breaking.
## 0.2.1
- [BREAKING] The component no longer automatically gets a `ember-power-calendar--loading` when
  the `onCenterChange` returns a promise/task. Instead, the publicAPI of the component will have
  the `loading` flag set to true, and you can use that to any purpose. This flag might change
  in future.

## 0.1.8
- [BUGFIX] Fix styles in IE11 - @nwhittaker

## 0.1.7
- [BUGFIX] Fix calculation of days when the `moment` global had a different locale than the `service:moment`.

## 0.1.6
- [BUGFIX] Make `ember-assign-helper` a runtime dependency.

## 0.1.5
- [FEATURE] Add `maxRange` to prevent users from selecting ranges > the given duration.
- [FEATURE] Add `minRange` to prevent users from selecting ranges < the given duration.
- [BUGFIX] If a range has `start` and `end` in the same day, that day has both `*--range-start` and `*--range-end` classes.
- [BREAKING] Rename `calendar.actions.changeCenter` to `calendar.actions.moveCenter`.
- [BUGFIX] Clicking on the last selected day selected it twice instead of removing it.

## 0.1.4
- [FEATURE] Add `weekdayFormat` to customize the format of the weekdays. Values: "short" (default), "long" and "min".

## 0.1.3
- [FEATURE] Add `calendarCenter` and `calendarSelect` test-helpers for acceptnace testing.

## 0.1.2
- [FEATURE] Add `i18n` based in ember-moment.

## 0.1.1
- [FEATURE] Add `minDate` and `maxDate` to default `{{calendar.days}}` component to disabled days before/after
  some specific date.
