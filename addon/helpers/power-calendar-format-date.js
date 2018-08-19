import { helper } from '@ember/component/helper';
import { formatDate } from 'ember-power-calendar-moment';

export function powerCalendarFormatDate([date, format], { locale }) {
  return formatDate(date, format, locale);
}

export default helper(powerCalendarFormatDate);
