## Master

## 0.2.0
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