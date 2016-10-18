import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../assertions';
import moment from 'moment';
import run from 'ember-runloop';
import getOwner from 'ember-owner/get';
import $ from 'jquery';
import RSVP from 'rsvp';

function triggerKeydown(domElement, k) {
  let oEvent = document.createEvent('Events');
  oEvent.initEvent('keydown', true, true);
  $.extend(oEvent, {
    view: window,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    keyCode: k,
    charCode: k
  });
  run(() => {
    domElement.dispatchEvent(oEvent);
  });
}

let calendarService;
moduleForComponent('power-calendar', 'Integration | Component | Power Calendar', {
  integration: true,
  beforeEach() {
    assertionInjector(this);
    calendarService = getOwner(this).lookup('service:calendar');
    calendarService.set('date', new Date(2013, 9, 18));
  },

  afterEach() {
    assertionCleanup(this);
  }
});

test('Rendered without any arguments, it displays the current month and has no month navigation', function(assert) {
  assert.expect(3);
  this.render(hbs`{{power-calendar}}`);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('October 2013') > -1, 'The calendar is centered in the present');
  assert.equal(this.$('.ember-power-calendar-nav-control').length, 0, 'There is no controls to navigate months');
  assert.equal(this.$('.ember-power-calendar-day[data-date="2013-10-01"]').length, 1, 'The days in the calendar actually belong to the presnet month');
});

test('when it receives a Date in the `displayedMonth` argument, it displays that month', function(assert) {
  assert.expect(3);
  this.displayedMonth = new Date(2016, 1, 5);
  this.render(hbs`{{power-calendar displayedMonth=displayedMonth}}`);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the the passed month');
  assert.equal(this.$('.ember-power-calendar-nav-control').length, 0, 'There is no controls to navigate months');
  assert.equal(this.$('.ember-power-calendar-day[data-date="2016-02-29"]').length, 1, 'The days in the calendar actually belong to the displayed month');
});

test('when it receives a `moment()` in the `displayedMonth` argument, it displays that month', function(assert) {
  assert.expect(3);
  this.displayedMonth = moment('2016-02-05');
  this.render(hbs`{{power-calendar displayedMonth=displayedMonth}}`);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the the passed month');
  assert.equal(this.$('.ember-power-calendar-nav-control').length, 0, 'There is no controls to navigate months');
  assert.equal(this.$('.ember-power-calendar-day[data-date="2016-02-29"]').length, 1, 'The days in the calendar actually belong to the displayed month');
});

test('when it receives a `displayedMonth` and an `onMonthChange` action, it shows controls to go to the next & previous month and the action is called when they are clicked', function(assert) {
  assert.expect(7);
  this.displayedMonth = new Date(2016, 1, 5);
  this.changeMonth = function() {
    assert.ok(true, 'The changeMonth action is invoked');
  };
  this.render(hbs`{{power-calendar displayedMonth=displayedMonth onMonthChange=changeMonth}}`);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the the passed month');
  assert.equal(this.$('.ember-power-calendar-nav-control--previous').length, 1, 'There is a control to go to previous month');
  assert.equal(this.$('.ember-power-calendar-nav-control--next').length, 1, 'There is a control to go to next month');

  run(() => this.$('.ember-power-calendar-nav-control--previous').click());
  run(() => this.$('.ember-power-calendar-nav-control--next').click());
  run(() => this.$('.ember-power-calendar-nav-control--next').click());

  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is still centered in the the passed month');
});

test('when the `onMonthChange` action changes the `displayedMonth` attribute, the calendar shows the new month', function(assert) {
  assert.expect(2);
  this.displayedMonth = new Date(2016, 1, 5);
  this.render(hbs`{{power-calendar displayedMonth=displayedMonth onMonthChange=(action (mut displayedMonth))}}`);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the the passed month');

  run(() => this.$('.ember-power-calendar-nav-control--next').click());

  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('March 2016') > -1, 'The calendar is now centered in the the next month');
});

test('when it receives a Date in the `selected` argument, it displays that month, and that day is marked as selected', function(assert) {
  assert.expect(4);
  this.selected = new Date(2016, 1, 5);
  this.render(hbs`{{power-calendar selected=selected}}`);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the month of the selected date');
  assert.equal(this.$('.ember-power-calendar-day[data-date="2016-02-29"]').length, 1, 'The days in the calendar actually belong to the displayed month');
  assert.equal(this.$('.ember-power-calendar-day--selected').length, 1, 'There is one day marked as selected');
  assert.equal(this.$('.ember-power-calendar-day--selected').data('date'), '2016-02-05', 'The passed `selected` is the selected day');
});

test('when it receives a `moment` in the `selected` argument, it displays that month, and that day is marked as selected', function(assert) {
  assert.expect(4);
  this.selected = moment('2016-02-05');
  this.render(hbs`{{power-calendar selected=selected}}`);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the month of the selected date');
  assert.equal(this.$('.ember-power-calendar-day[data-date="2016-02-29"]').length, 1, 'The days in the calendar actually belong to the displayed month');
  assert.equal(this.$('.ember-power-calendar-day--selected').length, 1, 'There is one day marked as selected');
  assert.equal(this.$('.ember-power-calendar-day--selected').data('date'), '2016-02-05', 'The passed `selected` is the selected day');
});

test('when it receives both `selected` and `displayedMonth`, `displayedMonth` trumps and that month is displayed', function(assert) {
  assert.expect(4);
  this.selected = new Date(2016, 2, 5);
  this.displayedMonth = new Date(2016, 1, 5);
  this.render(hbs`{{power-calendar selected=selected displayedMonth=displayedMonth}}`);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the `displayedMonth`, no on the `selected` date');
  assert.equal(this.$('.ember-power-calendar-day[data-date="2016-02-29"]').length, 1, 'The days in the calendar actually belong to the displayed month');
  assert.equal(this.$('.ember-power-calendar-day--selected').length, 1, 'There is one day marked as selected');
  assert.equal(this.$('.ember-power-calendar-day--selected').data('date'), '2016-03-05', 'The passed `selected` is the selected day');
});

test('The days that belong to the currently displayed month have a distintive class that the days belonging to the previous/next month don\'t', function(assert) {
  assert.expect(4);
  this.render(hbs`{{power-calendar}}`);
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-01"]').hasClass('ember-power-calendar-day--current-month'), 'Days of the current month have this class');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-31"]').hasClass('ember-power-calendar-day--current-month'), 'Days of the current month have this class');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-09-30"]').hasClass('ember-power-calendar-day--current-month'), 'Days of the previous month don\'t');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-11-01"]').hasClass('ember-power-calendar-day--current-month'), 'Days of the previous month don\'t');
});

test('The current day has a special class that other days don\'t', function(assert) {
  assert.expect(3);
  this.render(hbs`{{power-calendar}}`);
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-18"]').hasClass('ember-power-calendar-day--today'), 'The current day has a special class');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-19"]').hasClass('ember-power-calendar-day--today'));
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-17"]').hasClass('ember-power-calendar-day--today'));
});

test('It shows the abbreviation of the week-days starting on Monday', function(assert) {
  assert.expect(1);
  this.render(hbs`{{power-calendar}}`);
  assert.equal(this.$('.ember-power-calendar-weekdays').text().replace(/\s+/g, ' ').trim(), 'Mon Tue Wed Thu Fri Sat Sun');
});

test('If there is no `onChange` action, days cannot be focused', function(assert) {
  assert.expect(1);
  this.render(hbs`{{power-calendar}}`);
  let $dayElement = this.$('.ember-power-calendar-day[data-date="2013-10-18"]');
  run(() => $dayElement.focus());
  assert.notEqual(document.activeElement, $dayElement.get(0));
});

test('If there is an `onChange` action, days can be focused', function(assert) {
  assert.expect(1);
  this.render(hbs`{{power-calendar onChange=(action (mut foo))}}`);
  let $dayElement = this.$('.ember-power-calendar-day[data-date="2013-10-18"]');
  run(() => $dayElement.focus());
  assert.equal(document.activeElement, $dayElement.get(0));
});

test('If a day is focused, it gets a special hasClass', function(assert) {
  assert.expect(3);
  this.render(hbs`{{power-calendar onChange=(action (mut foo))}}`);
  let $dayElement = this.$('.ember-power-calendar-day[data-date="2013-10-18"]');
  run(() => $dayElement.focus());
  assert.ok($dayElement.hasClass('ember-power-calendar-day--focused'), 'The focused day gets a special class');
  let $anotherDayElement = this.$('.ember-power-calendar-day[data-date="2013-10-21"]');
  run(() => $anotherDayElement.focus());
  assert.notOk($dayElement.hasClass('ember-power-calendar-day--focused'), 'The focused day gets a special class');
  assert.ok($anotherDayElement.hasClass('ember-power-calendar-day--focused'), 'The focused day gets a special class');
});

test('Clicking one day, triggers the `onChange` action with that day (which is a object with some basic information)', function(assert) {
  assert.expect(2);
  this.didChange = function(day, e) {
    assert.isDay(day, 'The first argument is a day object');
    assert.ok(e instanceof Event, 'The second argument is an event');
  };
  this.render(hbs`{{power-calendar onChange=(action didChange)}}`);
  let dayElement = this.$('.ember-power-calendar-day[data-date="2013-10-18"]').get(0);
  run(() => dayElement.click());
});

test('If the `onChange` updates the selected value, it can work as a date-selector', function(assert) {
  assert.expect(2);
  this.selected = new Date(2016, 1, 5);
  this.render(hbs`{{power-calendar selected=selected onChange=(action (mut selected) value="date")}}`);
  assert.equal(this.$('.ember-power-calendar-day--selected').data('date'), '2016-02-05');
  run(() => this.$('.ember-power-calendar-day[data-date="2016-02-21"]').click());
  assert.equal(this.$('.ember-power-calendar-day--selected').data('date'), '2016-02-21');
});

test('If a day is focused, using left/right arrow keys focuses the previous/next day', function(assert) {
  assert.expect(6);
  this.render(hbs`{{power-calendar onChange=(action (mut selected) value="date")}}`);

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-18"]').focus());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-18"]').hasClass('ember-power-calendar-day--focused'));
  assert.equal(document.activeElement, this.$('.ember-power-calendar-day[data-date="2013-10-18"]').get(0));

  triggerKeydown(this.$('.ember-power-calendar-day[data-date="2013-10-18"]').get(0), 37); // left arrow
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-17"]').hasClass('ember-power-calendar-day--focused'));
  assert.equal(document.activeElement, this.$('.ember-power-calendar-day[data-date="2013-10-17"]').get(0));

  triggerKeydown(this.$('.ember-power-calendar-day[data-date="2013-10-17"]').get(0), 39); // right arrow
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-18"]').hasClass('ember-power-calendar-day--focused'));
  assert.equal(document.activeElement, this.$('.ember-power-calendar-day[data-date="2013-10-18"]').get(0));
});

test('If a day is focused, using up/down arrow keys focuses the same weekday of the previous/next week', function(assert) {
  assert.expect(6);
  this.render(hbs`{{power-calendar onChange=(action (mut selected) value="date")}}`);

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-18"]').focus());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-18"]').hasClass('ember-power-calendar-day--focused'));
  assert.equal(document.activeElement, this.$('.ember-power-calendar-day[data-date="2013-10-18"]').get(0));

  triggerKeydown(this.$('.ember-power-calendar-day[data-date="2013-10-18"]').get(0), 38); // left arrow
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-11"]').hasClass('ember-power-calendar-day--focused'));
  assert.equal(document.activeElement, this.$('.ember-power-calendar-day[data-date="2013-10-11"]').get(0));

  triggerKeydown(this.$('.ember-power-calendar-day[data-date="2013-10-17"]').get(0), 40); // right arrow
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-18"]').hasClass('ember-power-calendar-day--focused'));
  assert.equal(document.activeElement, this.$('.ember-power-calendar-day[data-date="2013-10-18"]').get(0));
});

test('If the `onMonthChange` action returns a `thenable`, the component enter loading state while that thenable resolves or rejects', function(assert) {
  assert.expect(2);
  let done = assert.async();
  this.asyncAction = function() {
    return new RSVP.Promise(function(resolve) {
      run.later(resolve, 200);
    });
  };
  this.render(hbs`{{power-calendar onMonthChange=(action asyncAction)}}`);

  setTimeout(function() {
    assert.ok(this.$('.ember-power-calendar').hasClass('ember-power-calendar--loading'), 'The component is in a loading state');
  }, 100);

  run(() => this.$('.ember-power-calendar-nav-control--next').click());

  setTimeout(function() {
    assert.notOk(this.$('.ember-power-calendar').hasClass('ember-power-calendar--loading'), 'The component is not in a loading state anymore');
    done();
  }, 250);
});

test('when it receives a range in the `selected` argument containing `Date` objects, the range is highlighted', function(assert) {
  assert.expect(4);
  this.selected = { start: new Date(2016, 1, 5), end: new Date(2016, 1, 9) };
  this.render(hbs`{{power-calendar range=true selected=selected}}`);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the month of the selected date');
  let allDaysInRangeAreSelected = this.$('.ember-power-calendar-day[data-date="2016-02-05"]').hasClass('ember-power-calendar-day--selected')
    && this.$('.ember-power-calendar-day[data-date="2016-02-06"]').hasClass('ember-power-calendar-day--selected')
    && this.$('.ember-power-calendar-day[data-date="2016-02-07"]').hasClass('ember-power-calendar-day--selected')
    && this.$('.ember-power-calendar-day[data-date="2016-02-08"]').hasClass('ember-power-calendar-day--selected')
    && this.$('.ember-power-calendar-day[data-date="2016-02-09"]').hasClass('ember-power-calendar-day--selected');
  assert.ok(allDaysInRangeAreSelected, 'All days in range are selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2016-02-05"]').hasClass('ember-power-calendar-day--range-start'), 'The start of the range has a special class');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2016-02-09"]').hasClass('ember-power-calendar-day--range-end'), 'The end of the range has a special class');
});

test('In range calendars, clicking a day selects one end of the range, and clicking another closes the range', function(assert) {
  this.selected = null;
  let numberOfCalls = 0;
  this.didChange = (range, e) => {
    numberOfCalls++;
    if (numberOfCalls === 1) {
      assert.ok(range.date.start, 'The start is present');
      assert.notOk(range.date.end, 'The end is not present');
    } else {
      assert.ok(range.date.start, 'The start is present');
      assert.ok(range.date.end, 'The start is also present');
    }
    this.set('selected', range.date);
    assert.ok(e instanceof Event, 'The second argument is an event');
  };
  this.render(hbs`{{power-calendar range=true selected=selected onChange=(action didChange)}}`);

  assert.equal(this.$('.ember-power-calendar-day--selected').length, 0, 'No days have been selected');
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-10"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--selected'), 'The clicked date is selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--range-start'), 'The clicked date is the start of the range');
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-15"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--selected'), 'The first clicked date is still selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--range-start'), 'The first clicked date is still the start of the range');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-15"]').hasClass('ember-power-calendar-day--selected'), 'The clicked date is selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-15"]').hasClass('ember-power-calendar-day--range-end'), 'The clicked date is the start of the range');
  let allDaysInBetweenAreSelected = this.$('.ember-power-calendar-day[data-date="2013-10-11"]').hasClass('ember-power-calendar-day--selected')
    && this.$('.ember-power-calendar-day[data-date="2013-10-12"]').hasClass('ember-power-calendar-day--selected')
    && this.$('.ember-power-calendar-day[data-date="2013-10-13"]').hasClass('ember-power-calendar-day--selected')
    && this.$('.ember-power-calendar-day[data-date="2013-10-14"]').hasClass('ember-power-calendar-day--selected');
  assert.ok(allDaysInBetweenAreSelected, 'All days in between are also selected');
  assert.equal(numberOfCalls, 2, 'The onChange action was called twice');
});

test('In range calendars, clicking first the end of the range and then the start is not a problem', function(assert) {
  this.selected = null;
  let numberOfCalls = 0;
  this.didChange = (range, e) => {
    numberOfCalls++;
    if (numberOfCalls === 1) {
      assert.ok(range.date.start, 'The start is present');
      assert.notOk(range.date.end, 'The end is not present');
    } else {
      assert.ok(range.date.start, 'The start is present');
      assert.ok(range.date.end, 'The start is also present');
    }
    this.set('selected', range.date);
    assert.ok(e instanceof Event, 'The second argument is an event');
  };
  this.render(hbs`{{power-calendar range=true selected=selected onChange=(action didChange)}}`);

  assert.equal(this.$('.ember-power-calendar-day--selected').length, 0, 'No days have been selected');
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-15"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-15"]').hasClass('ember-power-calendar-day--selected'), 'The clicked date is selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-15"]').hasClass('ember-power-calendar-day--range-start'), 'The clicked date is the start of the range');
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-10"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--selected'), 'The first clicked date is still selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--range-start'), 'The first clicked date is still the start of the range');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-15"]').hasClass('ember-power-calendar-day--selected'), 'The clicked date is selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-15"]').hasClass('ember-power-calendar-day--range-end'), 'The clicked date is the start of the range');
  let allDaysInBetweenAreSelected = this.$('.ember-power-calendar-day[data-date="2013-10-11"]').hasClass('ember-power-calendar-day--selected')
    && this.$('.ember-power-calendar-day[data-date="2013-10-12"]').hasClass('ember-power-calendar-day--selected')
    && this.$('.ember-power-calendar-day[data-date="2013-10-13"]').hasClass('ember-power-calendar-day--selected')
    && this.$('.ember-power-calendar-day[data-date="2013-10-14"]').hasClass('ember-power-calendar-day--selected');
  assert.ok(allDaysInBetweenAreSelected, 'All days in between are also selected');
  assert.equal(numberOfCalls, 2, 'The onChange action was called twice');
});

test('When a multiple calendar receives an array of dates, those dates are marked as selected', function(assert) {
  assert.expect(5);
  this.selected = [new Date(2016, 1, 5), new Date(2016, 1, 9), new Date(2016, 1, 15)];

  this.render(hbs`{{power-calendar multiple=true selected=selected}}`);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the month of the first selected date');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2016-02-05"]').hasClass('ember-power-calendar-day--selected'), 'The first selected day is selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2016-02-09"]').hasClass('ember-power-calendar-day--selected'), 'The second selected day is selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2016-02-15"]').hasClass('ember-power-calendar-day--selected'), 'The third selected day is selected');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2016-02-08"]').hasClass('ember-power-calendar-day--selected'), 'The days in between those aren\'t day is selected');
})
