const msPerUnit = {
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 86400000,
};

const singulars = {
  seconds: 'second',
  minutes: 'minute',
  hours: 'hour',
  day: 'day',
};

function singularizeUnits(units) {
  return singulars[units] || units;

}
export function add(date, quantity, unit) {
  return new Date(+date + quantity * msPerUnit[singularizeUnits(unit)]);
}

export function startOf(date, unit) {
  let result = new Date(date);
  unit = singularizeUnits(unit);
  // the following switch intentionally omits break keywords
  // to utilize falling through the cases.
  switch (unit) {
    case 'year':
      result.setMonth(0);
    /* falls through */
    case 'quarter':
    case 'month':
      result.setDate(1);
    /* falls through */
    case 'week':
    case 'isoWeek':
    case 'day':
    case 'date':
      result.setHours(0);
    /* falls through */
    case 'hour':
      result.setMinutes(0);
    /* falls through */
    case 'minute':
      result.setSeconds(0);
    /* falls through */
    case 'second':
      result.setMilliseconds(0);
  }

  // weeks are a special case
  if (unit === 'week') {
    throw new Error('week unit not yet supported');
    // this.weekday(0);
  }
  if (unit === 'isoWeek') {
    throw new Error("isoWeek unit not yet supported");
    // this.isoWeekday(1);
  }

  if (unit === 'quarter') {
    throw new Error("quarter unit not yet supported");
  }

  return this;
}

export function formatDate(date, format) {
  return new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
}
