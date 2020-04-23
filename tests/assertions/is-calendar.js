import ownProp from 'ember-power-calendar/-private/utils/own-prop';

export default function isCalendar(_context, calendar, message) {
  let result = !!calendar
    && ownProp(calendar, 'center')
    && typeof calendar.loading === 'boolean'
    && ownProp(calendar, 'locale')
    && ownProp(calendar, 'selected')
    && ownProp(calendar, 'uniqueId')
    && ownProp(calendar, 'actions');

  this.pushResult({
    result,
    actual: result,
    expected: true,
    message
  });
}
