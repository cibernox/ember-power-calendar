export default function isQuarter(context, quarter, message = 'Is a valid quarter object') {
  let result = typeof quarter.isSelected === 'boolean'
    && typeof quarter.id === 'string'
    && typeof quarter.label === 'string'
    && Array.isArray(quarter.months)
    && quarter.date instanceof Date
    && quarter.period === 'quarter';

  this.pushResult({
    result,
    actual: result,
    expected: true,
    message
  });
}
