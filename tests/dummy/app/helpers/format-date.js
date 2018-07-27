import { helper } from '@ember/component/helper';
import { formatDate } from 'ember-power-calendar/utils/date-utils';

export function formatDateHelper([date, format]) {
  return formatDate(date, format);
}

export default helper(formatDateHelper);
