import type { PowerCalendarDay } from "ember-power-calendar/utils";

export default function isDay(this: Assert, day: PowerCalendarDay, message: string = 'Is a valid day object') {
  const result =
    typeof day.isCurrentMonth === 'boolean' &&
    typeof day.isToday === 'boolean' &&
    typeof day.isSelected === 'boolean' &&
    typeof day.isFocused === 'boolean' &&
    typeof day.isCurrentMonth === 'boolean' &&
    typeof day.isDisabled === 'boolean' &&
    typeof day.id === 'string' &&
    day.date instanceof Date;

  this.pushResult({
    result,
    actual: result,
    expected: true,
    message,
  });
}
