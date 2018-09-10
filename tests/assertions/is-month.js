export default function isMonth(context, day, message = 'Is a valid day object') {
  let result = typeof day.isCurrentMonth === 'boolean'
    && typeof day.isSelected === 'boolean'
    && typeof day.isFocused === 'boolean'
    && typeof day.isCurrentMonth === 'boolean'
    && typeof day.isDisabled === 'boolean'
    && typeof day.id === 'string'
    && day.date instanceof Date
    && day.period === 'month';

  this.pushResult({
    result,
    actual: result,
    expected: true,
    message
  });
}
