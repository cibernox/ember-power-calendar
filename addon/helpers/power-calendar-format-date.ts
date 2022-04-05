import { formatDate } from 'ember-power-calendar-utils';

import { helper } from '@ember/component/helper';

export function powerCalendarFormatDate(
  [date, format]: [Date, string],
  { locale }: { locale: string }
) {
  return formatDate(date, format, locale);
}

export default helper(powerCalendarFormatDate);
