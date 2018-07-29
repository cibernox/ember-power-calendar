import moment from 'moment';

// const aliases = {
//   y: 'year',
//   years: 'year',
//   year: 'year',
//   M: 'month',
//   months: 'month',
//   month: 'month',
//   w: 'week',
//   weeks: 'week',
//   week: 'week',
//   W: 'isoWeek',
//   isoweeks: 'isoWeek',
//   isoweek: 'isoWeek',
//   d: 'day',
//   days: 'day',
//   day: 'day',
//   e: 'weekday',
//   weekdays: 'weekday',
//   weekday: 'weekday',
//   E: 'isoWeekday',
//   isoweekdays: 'isoWeekday',
//   isoweekday: 'isoWeekday',
//   h: 'hour',
//   hours: 'hour',
//   hour: 'hour',
//   gg: 'weekYear',
//   weekyears: 'weekYear',
//   weekyear: 'weekYear',
//   GG: 'isoWeekYear',
//   isoweekyears: 'isoWeekYear',
//   isoweekyear: 'isoWeekYear',
//   Q: 'quarter',
//   quarters: 'quarter',
//   quarter: 'quarter',
//   D: 'date',
//   dates: 'date',
//   date: 'date',
//   DDD: 'dayOfYear',
//   dayofyears: 'dayOfYear',
//   dayofyear: 'dayOfYear',
//   m: 'minute',
//   minutes: 'minute',
//   minute: 'minute',
//   s: 'second',
//   seconds: 'second',
//   second: 'second',
//   ms: 'millisecond',
//   milliseconds: 'millisecond',
//   millisecond: 'millisecond'
// }

// const weekdaysShort = [];

// export function getWeekdaysShort() {
//   if (weekdaysShort.length === 0) {
//     let date = new Date(0);
//     date.setDate(4 + date.getDate());
//     let day = date.getDate();
//     for (let i = 0; i < 7; i++) {
//       date.setDate(day + i);
//       weekdaysShort.push(new Intl.DateTimeFormat(["en"], { weekday: "short" }).format(date));
//     }
//   }
//   return weekdaysShort;
// }

// export function startOf(date, unit) {
//   let result = new Date(date);
//   unit = normalizeUnits(unit);
//   // the following switch intentionally omits break keywords
//   // to utilize falling through the cases.
//   switch (unit) {
//     case 'year':
//       result.setMonth(0);
//     /* falls through */
//     case 'quarter':
//     case 'month':
//       result.setDate(1);
//     /* falls through */
//     case 'week':
//     case 'isoWeek':
//     case 'day':
//     case 'date':
//       result.setHours(0);
//     /* falls through */
//     case 'hour':
//       result.setMinutes(0);
//     /* falls through */
//     case 'minute':
//       result.setSeconds(0);
//     /* falls through */
//     case 'second':
//       result.setMilliseconds(0);
//   }

//   // weeks are a special case
//   if (unit === 'week') {
//     let dow = weekday(date);
//     result = add(result, -(dow - 1), 'days')
//   }
//   if (unit === 'isoWeek') {
//     throw new Error("isoWeek unit not yet supported");
//     // this.isoWeekday(1);
//   }

//   if (unit === 'quarter') {
//     throw new Error("quarter unit not yet supported");
//   }

//   return result;
// }

// export function endOf(date, unit) {
//   unit = normalizeUnits(unit);
//   if (unit === undefined || unit === 'millisecond') {
//     return date;
//   }
//   return add(add(startOf(date, unit), 1, (unit === 'isoWeek' ? 'week' : unit)), -1, 'millisecond');
// }

// export function isoWeekday(date) {
//   const js = new Date(date).getUTCDay();
//   return js === 0 ? 7 : js;
// }

// export function weekday(date) { // either this or the isoWeekday is wrong, IDK yet
//   const js = new Date(date).getUTCDay();
//   return js === 0 ? 7 : js;
// }

// export function isBefore(date1, date2) {
//   return +date1 < +date2;
// }

// export function isAfter(date1, date2) {
//   return +date1 > +date2;
// }

// export function isSame(date1, date2, unit) {
//   unit = normalizeUnits(unit);
//   let result = true;
//   switch (unit) {
//     case "week":
//       throw new Error('isSame is not implemented for unit "week');
//     case "millisecond":
//       result = result && date1.getMilliseconds() === date2.getMilliseconds();
//       /* falls through */
//     case "second":
//       result = result && date1.getSeconds() === date2.getSeconds();
//       /* falls through */
//     case "minute":
//       result = result && date1.getMinutes() === date2.getMinutes();
//       /* falls through */
//     case "hour":
//       result = result && date1.getHours() === date2.getHours();
//       /* falls through */
//     case "day":
//       result = result && date1.getDate() === date2.getDate();
//       /* falls through */
//     case "month":
//       result = result && date1.getMonth() === date2.getMonth();
//       /* falls through */
//     case "year":
//       result = result && date1.getFullYear() === date2.getFullYear();
//   }
//   return result;
// }

// /** DURATION */
// function Duration(duration) {
//   var normalizedInput = normalizeObjectUnits(duration),
//     years = normalizedInput.year || 0,
//     quarters = normalizedInput.quarter || 0,
//     months = normalizedInput.month || 0,
//     weeks = normalizedInput.week || 0,
//     days = normalizedInput.day || 0,
//     hours = normalizedInput.hour || 0,
//     minutes = normalizedInput.minute || 0,
//     seconds = normalizedInput.second || 0,
//     milliseconds = normalizedInput.millisecond || 0;

//   // representation for dateAddRemove
//   this._milliseconds = +milliseconds +
//     seconds * 1e3 + // 1000
//     minutes * 6e4 + // 1000 * 60
//     hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
//   // Because of dateAddRemove treats 24 hours as different from a
//   // day when working around DST, we need to store them separately
//   this._days = +days +
//     weeks * 7;
//   // It is impossible translate months into days without knowing
//   // which months you are are talking about, so we have to store
//   // it separately.
//   this._months = +months +
//     quarters * 3 +
//     years * 12;

//   this._data = {};

//   this._bubble();
// }

// function bubble() {
//   var milliseconds = this._milliseconds;
//   var days = this._days;
//   var months = this._months;
//   var data = this._data;
//   var seconds, minutes, hours, years, monthsFromDays;

//   // if we have a mix of positive and negative values, bubble down first
//   // check: https://github.com/moment/moment/issues/2166
//   if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
//     (milliseconds <= 0 && days <= 0 && months <= 0))) {
//     milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
//     days = 0;
//     months = 0;
//   }

//   // The following code bubbles up values, see the tests for
//   // examples of what that means.
//   data.milliseconds = milliseconds % 1000;

//   seconds = absFloor(milliseconds / 1000);
//   data.seconds = seconds % 60;

//   minutes = absFloor(seconds / 60);
//   data.minutes = minutes % 60;

//   hours = absFloor(minutes / 60);
//   data.hours = hours % 24;

//   days += absFloor(hours / 24);

//   // convert days to months
//   monthsFromDays = absFloor(daysToMonths(days));
//   months += monthsFromDays;
//   days -= absCeil(monthsToDays(monthsFromDays));

//   // 12 months -> 1 year
//   years = absFloor(months / 12);
//   months %= 12;

//   data.days = days;
//   data.months = months;
//   data.years = years;

//   return this;
// }

// Duration.prototype._bubble = bubble;

// function daysToMonths(days) {
//   // 400 years have 146097 days (taking into account leap year rules)
//   // 400 years have 12 months === 4800
//   return days * 4800 / 146097;
// }

// function monthsToDays(months) {
//   // the reverse of daysToMonths
//   return months * 146097 / 4800;
// }

// function createDuration(input, key) {
//   var duration = input, ret;

//   if (typeof input === 'number') {
//     duration = {};
//     if (key) {
//       duration[key] = input;
//     } else {
//       duration.milliseconds = input;
//     }
//   } else if (duration == null) {
//     duration = {};
//   }

//   ret = new Duration(duration);

//   return ret;
// }

// function absCeil(number) {
//   if (number < 0) {
//     return Math.floor(number);
//   } else {
//     return Math.ceil(number);
//   }
// }
// function absFloor(number) {
//   if (number < 0) {
//     return Math.ceil(number) || 0;
//   } else {
//     return Math.floor(number);
//   }
// }

// export function add(date, quantity, unit) {
//   let other = createDuration(quantity, unit);
//   return new Date(+date + other._milliseconds + other._days * 86400000);
// }

// function normalizeUnits(units) {
//   return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
// }

// function normalizeObjectUnits(inputObject) {
//   var normalizedInput = {},
//     normalizedProp,
//     prop;

//   for (prop in inputObject) {
//     if (inputObject.hasOwnProperty(prop)) {
//       normalizedProp = normalizeUnits(prop);
//       if (normalizedProp) {
//         normalizedInput[normalizedProp] = inputObject[prop];
//       }
//     }
//   }

//   return normalizedInput;
// }

export function add(date, quantity, unit) {
  return moment(date).add(quantity, unit).toDate();
}

export function formatDate(date, format, locale = null) {
  if (locale) {
    return withLocale(locale, () => moment(date).format(format));
  } else {
    return moment(date).format(format);
  }
}

export function startOf(date, unit) {
  return moment(date).startOf(unit).toDate();
}

export function endOf(date, unit) {
  return moment(date).endOf(unit).toDate();
}

export function isoWeekday(date) {
  return moment(date).isoWeekday();
}

export function getWeekdaysShort() {
  return moment.weekdaysShort();
}

export function getWeekdaysMin() {
  return moment.weekdaysMin();
}

export function getWeekdays() {
  return moment.weekdays();
}

export function isAfter(date1, date2) {
  return moment(date1).isAfter(date2);
}

export function isBefore(date1, date2) {
  return moment(date1).isBefore(date2);
}

export function isSame(date1, date2, unit) {
  return moment(date1).isSame(date2, unit);
}

export function isBetween(date, start, end, unit, inclusivity) {
  return moment(date).isBetween(start, end, unit, inclusivity);
}

export function diff(date1, date2) {
  return moment(date1).diff(date2);
}

export function normalizeDate(dateOrMoment) {
  if (dateOrMoment === undefined || dateOrMoment === null || dateOrMoment instanceof Date) {
    return dateOrMoment;
  } else {
    return dateOrMoment.toDate();
  }
}

export function withLocale(locale, fn) {
  let returnValue;
  if (locale) {
    let previousLocale = moment.locale();
    moment.locale(locale);
    returnValue = fn();
    moment.locale(previousLocale);
  } else {
    returnValue = fn();
  }
  return returnValue;
}
