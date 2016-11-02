import Test from 'ember-test';
import run from 'ember-runloop';
import { assert } from 'ember-metal/utils';
import moment from 'moment';

function findCalendarElement(selector) {
  let target = find(selector);
  return target.hasClass('ember-power-calendar') ? target : target.find('.ember-power-calendar');
}

function findComponentInstance(app, selector) {
  let calendarElement = findCalendarElement(selector);
  let calendarId = calendarElement.attr('id');
  let container = app.__container__;
  // Warning. This is super-private.
  let viewRegisty = container.lookup('-view-registry:main');
  return viewRegisty[calendarId];
}

export default function() {
  Test.registerAsyncHelper('calendarCenter', function(app, selector, newCenter) {
    assert('`calendarCenter` expect a Date or MomentJS object as second argument', newCenter);
    let calendarComponent = findComponentInstance(app, selector);
    let onCenterChange = calendarComponent.get('onCenterChange');
    assert('You cannot call `calendarCenter` on a component that doesn\'t has an `onCenterChange` action', onCenterChange);
    let newCenterMoment = moment(newCenter);
    return onCenterChange({ date: newCenterMoment._d, moment: newCenterMoment });
  });

  Test.registerAsyncHelper('calendarSelect', function(app, selector, selected) {
    assert('`calendarSelect` expect a Date or MomentJS object as second argument', selected);
    let selectedMoment = moment(selected);
    let calendarElement = findCalendarElement(selector);
    let daySelector = `[data-date=${selectedMoment.format('YYYY-MM-DD')}]`;
    let dayElement = calendarElement.find(daySelector)
    if (dayElement.length === 0) {
      run(() => calendarCenter(selector, selected));
    }
    andThen(function() {
      click(daySelector);
    });
  });
}