import { formatDate } from '../utils.ts';

export default function powerCalendarFormatDate(
  date: Date,
  format: string,
  { locale }: { locale?: string | null },
) {
  return formatDate(date, format, locale);
}
