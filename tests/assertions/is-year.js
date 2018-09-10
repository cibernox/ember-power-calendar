export default function isYear(context, year, message = 'Is a valid day object') {
  let result = typeof year.isSelected === 'boolean'
    && typeof year.isFocused === 'boolean'
    && typeof year.isCurrentYear === 'boolean'
    && typeof year.isCurrentDecade === 'boolean'
    && typeof year.isDisabled === 'boolean'
    && typeof year.id === 'string'
    && year.date instanceof Date
    && year.period === 'year';

  this.pushResult({
    result,
    actual: result,
    expected: true,
    message
  });
}
