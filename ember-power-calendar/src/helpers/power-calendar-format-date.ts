import { formatDate } from '../utils.ts';

export function powerCalendarFormatDate(
  [date, format]: [Date, string],
  { locale }: { locale?: string | null },
) {
  return formatDate(date, format, locale);
}
