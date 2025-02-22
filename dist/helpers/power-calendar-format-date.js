import { helper } from '@ember/component/helper';
import { formatDate } from '../utils.js';

function powerCalendarFormatDate([date, format], {
  locale
}) {
  return formatDate(date, format, locale);
}
var powerCalendarFormatDate$1 = helper(powerCalendarFormatDate);

export { powerCalendarFormatDate$1 as default, powerCalendarFormatDate };
//# sourceMappingURL=power-calendar-format-date.js.map
