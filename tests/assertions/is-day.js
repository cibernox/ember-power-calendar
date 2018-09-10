export default function isDay(context, day, message = 'Is a valid day object') {
  let result = typeof day.isCurrentMonth === 'boolean'
    && typeof day.isToday === 'boolean'
    && typeof day.isSelected === 'boolean'
    && typeof day.isFocused === 'boolean'
    && typeof day.isCurrentMonth === 'boolean'
    && typeof day.isDisabled === 'boolean'
    && typeof day.id === 'string'
    && day.date instanceof Date
    && day.period === 'day';

  this.pushResult({
    result,
    actual: result,
    expected: true,
    message
  });
}
