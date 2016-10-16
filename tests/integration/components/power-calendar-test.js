import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../assertions';
import moment from 'moment';
import run from 'ember-runloop';
import getOwner from 'ember-owner/get';

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
  let dayElement = this.$('.ember-power-calendar-day[data-date="2013-10-18"]').get(0);
  run(() => dayElement.focus());
  assert.notEqual(document.activeElement, dayElement);
});

test('If there is an `onChange` action, days can be focused', function(assert) {
  assert.expect(1);
  this.render(hbs`{{power-calendar onChange=(action (mut foo))}}`);
  let dayElement = this.$('.ember-power-calendar-day[data-date="2013-10-18"]').get(0);
  run(() => dayElement.focus());
  assert.equal(document.activeElement, dayElement);
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
