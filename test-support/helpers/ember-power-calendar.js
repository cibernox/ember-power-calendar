import Test from 'ember-test';
import run from 'ember-runloop';
import { assert } from 'ember-metal/utils';
import moment from 'moment';

function findCalendarElement(selector) {
  let target = find(selector);
  if (target.hasClass('ember-power-calendar')) {
    return target;
  } else {
    let $insideCalendar = target.find('.ember-power-calendar');
    if ($insideCalendar.length) {
      return $insideCalendar;
    } else {
      let $calendarPiece = target.find('[data-power-calendar-id]');
      if ($calendarPiece.length) {
        return $calendarPiece;
      }
    }
  }
}

function findCalendarGuid(selector) {
  let $maybeCalendar = findCalendarElement(selector);
  if (!$maybeCalendar) {
    return;
  }
  if ($maybeCalendar.hasClass('ember-power-calendar')) {
    return $maybeCalendar.attr('id');
  } else {
    return $maybeCalendar.attr('data-power-calendar-id');
  }
}

function findComponentInstance(app, selector) {
  let calendarGuid = findCalendarGuid(selector);
  assert(`Could not find a calendar using selector: "${selector}"`, calendarGuid);
  let calendarService = app.__container__.lookup('service:power-calendar');
  return calendarService._calendars[calendarGuid];
}

export default function() {
  Test.registerAsyncHelper('calendarCenter', function(app, selector, newCenter) {
    assert('`calendarCenter` expect a Date or MomentJS object as second argument', newCenter);
    let calendarComponent = findComponentInstance(app, selector);
    let onCenterChange = calendarComponent.get('onCenterChange');
    assert('You cannot call `calendarCenter` on a component that doesn\'t has an `onCenterChange` action', !!onCenterChange);
    let newCenterMoment = moment(newCenter);
    return onCenterChange({ date: newCenterMoment._d, moment: newCenterMoment });
  });

  Test.registerAsyncHelper('calendarSelect', function(app, selector, selected) {
    assert('`calendarSelect` expect a Date or MomentJS object as second argument', selected);
    let selectedMoment = moment(selected);
    let calendarElement = findCalendarElement(selector);
    let daySelector = `${selector} [data-date=${selectedMoment.format('YYYY-MM-DD')}]`;
    let dayElement = calendarElement.find(daySelector)
    if (dayElement.length === 0) {
      run(() => calendarCenter(selector, selected));
    }
    andThen(function() {
      click(daySelector);
    });
  });
}
