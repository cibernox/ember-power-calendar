import { find } from 'ember-native-dom-helpers';

function findCalendarElement(selector) {
  let target = find(selector);
  if (target) {
    if (target.classList.contains('ember-power-calendar')) {
      return target;
    } else {
      return (
        find('.ember-power-calendar', target)
        || find('[data-power-calendar-id]', target)
      );
    }
  }
}

export default findCalendarElement;
