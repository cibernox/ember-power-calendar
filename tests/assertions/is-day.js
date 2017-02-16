export default function isDay(context, day, message = 'Is a valid day object') {
  let result = typeof day.isCurrentMonth === 'boolean'
    && typeof day.isToday === 'boolean'
    && typeof day.isSelected === 'boolean'
    && typeof day.isFocused === 'boolean'
    && typeof day.isCurrentMonth === 'boolean'
    && typeof day.isDisabled === 'boolean'
    && typeof day.id === 'string'
    && day.moment._isAMomentObject
    && day.date instanceof Date;

  this.pushResult({
    result,
    actual: result,
    expected: true,
    message
  });
}
