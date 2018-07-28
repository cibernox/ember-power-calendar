const msPerUnit = {
  millisecond: 1,
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 86400000,
};

const aliases = {
  ms: 'millisecond',
  milliseconds: 'millisecond',
  seconds: 'second',
  minutes: 'minute',
  hours: 'hour',
  days: 'day',
};

const weekdaysShort = [];

function normalizeUnits(units) {
  return aliases[units] || units;
}

export function getWeekdaysShort() {
  if (weekdaysShort.length === 0) {
    let date = new Date(0);
    date.setDate(4 + date.getDate());
    let day = date.getDate();
    for (let i = 0; i < 7; i++) {
      date.setDate(day + i);
      weekdaysShort.push(new Intl.DateTimeFormat(["en"], { weekday: "short" }).format(date));
    }
  }
  return weekdaysShort;
}

export function add(date, quantity, unit) {
  unit = normalizeUnits(unit);
  let ms = msPerUnit[unit];
  if (ms) {
    return new Date(+date + quantity * ms);
  } else if (unit === 'month') {
    let copy = new Date(date);
    let monthIncrease = quantity % 12;
    let month = date.getMonth() + monthIncrease;
    let sign = quantity > 0 ? 1 : -1;
    let yearIncrease = sign > 0 ? Math.floor(quantity / 12) : Math.ceil(quantity / 12);
    let year = date.getFullYear();
    if (month === 12) {
      month = 0;
    }
    year += yearIncrease;
    copy.setMonth(month);
    copy.setFullYear(year);
    return copy;
  }
}

export function startOf(date, unit) {
  let result = new Date(date);
  unit = normalizeUnits(unit);
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
    let dow = weekday(date);
    result = add(result, -(dow - 1), 'days')
  }
  if (unit === 'isoWeek') {
    throw new Error("isoWeek unit not yet supported");
    // this.isoWeekday(1);
  }

  if (unit === 'quarter') {
    throw new Error("quarter unit not yet supported");
  }

  return result;
}

export function endOf(date, unit) {
  unit = normalizeUnits(unit);
  if (unit === undefined || unit === 'millisecond') {
    return date;
  }
  return add(add(startOf(date, unit), 1, (unit === 'isoWeek' ? 'week' : unit)), -1, 'millisecond');
}

export function isoWeekday(date) {
  const js = new Date(date).getUTCDay();
  return js === 0 ? 7 : js;
}

export function weekday(date) { // either this or the isoWeekday is wrong, IDK yet
  const js = new Date(date).getUTCDay();
  return js === 0 ? 7 : js;
}

export function isBefore(date1, date2) {
  return +date1 < +date2;
}

export function isAfter(date1, date2) {
  return +date1 > +date2;
}

export function isSame(date1, date2, unit) {
  unit = normalizeUnits(unit);
  let result = true;
  switch (unit) {
    case "week":
      throw new Error('isSame is not implemented for unit "week');
    case "millisecond":
      result = result && date1.getMilliseconds() === date2.getMilliseconds();
    /* falls through */
    case "second":
      result = result && date1.getSeconds() === date2.getSeconds();
    /* falls through */
    case "minute":
      result = result && date1.getMinutes() === date2.getMinutes();
    /* falls through */
    case "hour":
      result = result && date1.getHours() === date2.getHours();
    /* falls through */
    case "day":
      result = result && date1.getDate() === date2.getDate();
    /* falls through */
      /* falls through */
    case "month":
      result = result && date1.getMonth() === date2.getMonth();
      /* falls through */
    case "year":
      result = result && date1.getFullYear() === date2.getFullYear();
  }
  return result;
}

export function formatDate(date, format) {
  let formatOptions = {};
  if (format === 'ddd') {
    formatOptions = { weekday: 'short' }
  } if (format === 'YYYY-MM-DD') {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  } else if (format === "MMMM YYYY") {
    formatOptions = { month: "long", year: 'numeric' };
  }
  return new Intl.DateTimeFormat("en-US", formatOptions).format(date);
}
