export default function isCalendar(context, calendar, message) {
  let result = !!calendar
    && calendar.hasOwnProperty('center')
    && typeof calendar.loading === 'boolean'
    && calendar.hasOwnProperty('locale')
    && calendar.hasOwnProperty('selected')
    && calendar.hasOwnProperty('uniqueId')
    && calendar.hasOwnProperty('actions');

  this.pushResult({
    result,
    actual: result,
    expected: true,
    message
  });
}
