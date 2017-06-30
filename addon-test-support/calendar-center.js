import { assert } from 'ember-metal/utils';
import { findComponentInstance } from './calendar-test-service';
import wait from 'ember-test-helpers/wait';

let calendarCenter = async function(selector, newCenter) {
  assert(
    '`calendarCenter` expect a Date or MomentJS object as second argument',
    newCenter
  );
  let calendarComponent = findComponentInstance(selector);
  let onCenterChange = calendarComponent.get('onCenterChange');
  assert(
    "You cannot call `calendarCenter` on a component that doesn't has an `onCenterChange` action",
    !!onCenterChange
  );
  let publicAPI = calendarComponent.get('publicAPI');
  await publicAPI.actions.changeCenter(newCenter, publicAPI);
  return wait();
};

export default calendarCenter;
