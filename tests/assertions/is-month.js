export default function isMonth(context, month, message = 'Is a valid day object') {
  let result = typeof month.isCurrentMonth === 'boolean'
    && typeof month.isSelected === 'boolean'
    && typeof month.isFocused === 'boolean'
    && typeof month.isCurrentMonth === 'boolean'
    && typeof month.isDisabled === 'boolean'
    && typeof month.id === 'string'
    && month.date instanceof Date
    && month.period === 'month';

  this.pushResult({
    result,
    actual: result,
    expected: true,
    message
  });
}
