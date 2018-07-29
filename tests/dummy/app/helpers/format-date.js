import { helper } from '@ember/component/helper';
import { formatDate } from 'ember-power-calendar/utils/date-utils';

export function formatDateHelper([date, format], { locale }) {
  return formatDate(date, format, locale);
}

export default helper(formatDateHelper);
