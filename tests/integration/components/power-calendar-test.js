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

moduleForComponent('power-calendar', 'Integration | Component | Power Calendar', {
  integration: true,
  beforeEach() {
    assertionInjector(this);
    let calendarService = getOwner(this).lookup('service:power-calendar-clock');
    calendarService.set('date', new Date(2013, 9, 18));
  },

  afterEach() {
    assertionCleanup(this);
  }
});

test('Rendered without any arguments, it displays the current month and has no month navigation', function(assert) {
  assert.expect(3);
  this.render(hbs`
    {{#power-calendar as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('October 2013') > -1, 'The calendar is centered in the present');
  assert.equal(this.$('.ember-power-calendar-nav-control').length, 0, 'There is no controls to navigate months');
  assert.equal(this.$('.ember-power-calendar-day[data-date="2013-10-01"]').length, 1, 'The days in the calendar actually belong to the presnet month');
});

test('when it receives a Date in the `center` argument, it displays that month', function(assert) {
  assert.expect(3);
  this.center = new Date(2016, 1, 5);
  this.render(hbs`
    {{#power-calendar center=center as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the the passed month');
  assert.equal(this.$('.ember-power-calendar-nav-control').length, 0, 'There is no controls to navigate months');
  assert.equal(this.$('.ember-power-calendar-day[data-date="2016-02-29"]').length, 1, 'The days in the calendar actually belong to the displayed month');
});

test('when it receives a `moment()` in the `center` argument, it displays that month', function(assert) {
  assert.expect(3);
  this.center = moment('2016-02-05');
  this.render(hbs`
    {{#power-calendar center=center as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the the passed month');
  assert.equal(this.$('.ember-power-calendar-nav-control').length, 0, 'There is no controls to navigate months');
  assert.equal(this.$('.ember-power-calendar-day[data-date="2016-02-29"]').length, 1, 'The days in the calendar actually belong to the displayed month');
});

test('when it receives a `center` and an `onCenterChange` action, it shows controls to go to the next & previous month and the action is called when they are clicked', function(assert) {
  assert.expect(7);
  this.center = new Date(2016, 1, 5);
  this.changeCenter = function() {
    assert.ok(true, 'The changeCenter action is invoked');
  };
  this.render(hbs`
    {{#power-calendar center=center onCenterChange=changeCenter as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the the passed month');
  assert.equal(this.$('.ember-power-calendar-nav-control--previous').length, 1, 'There is a control to go to previous month');
  assert.equal(this.$('.ember-power-calendar-nav-control--next').length, 1, 'There is a control to go to next month');

  run(() => this.$('.ember-power-calendar-nav-control--previous').click());
  run(() => this.$('.ember-power-calendar-nav-control--next').click());
  run(() => this.$('.ember-power-calendar-nav-control--next').click());

  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is still centered in the the passed month');
});

test('when the `onCenterChange` action changes the `center` attribute, the calendar shows the new month', function(assert) {
  assert.expect(2);
  this.center = new Date(2016, 1, 5);
  this.render(hbs`
    {{#power-calendar center=center onCenterChange=(action (mut center) value="date") as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the the passed month');

  run(() => this.$('.ember-power-calendar-nav-control--next').click());

  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('March 2016') > -1, 'The calendar is now centered in the the next month');
});

test('when it receives a Date in the `selected` argument, it displays that month, and that day is marked as selected', function(assert) {
  assert.expect(4);
  this.selected = new Date(2016, 1, 5);
  this.render(hbs`
    {{#power-calendar selected=selected as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the month of the selected date');
  assert.equal(this.$('.ember-power-calendar-day[data-date="2016-02-29"]').length, 1, 'The days in the calendar actually belong to the displayed month');
  assert.equal(this.$('.ember-power-calendar-day--selected').length, 1, 'There is one day marked as selected');
  assert.equal(this.$('.ember-power-calendar-day--selected').data('date'), '2016-02-05', 'The passed `selected` is the selected day');
});

test('when it receives a `moment` in the `selected` argument, it displays that month, and that day is marked as selected', function(assert) {
  assert.expect(4);
  this.selected = moment('2016-02-05');
  this.render(hbs`
    {{#power-calendar selected=selected as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the month of the selected date');
  assert.equal(this.$('.ember-power-calendar-day[data-date="2016-02-29"]').length, 1, 'The days in the calendar actually belong to the displayed month');
  assert.equal(this.$('.ember-power-calendar-day--selected').length, 1, 'There is one day marked as selected');
  assert.equal(this.$('.ember-power-calendar-day--selected').data('date'), '2016-02-05', 'The passed `selected` is the selected day');
});

test('when it receives both `selected` and `center`, `center` trumps and that month is displayed', function(assert) {
  assert.expect(4);
  this.selected = new Date(2016, 2, 5);
  this.center = new Date(2016, 1, 5);
  this.render(hbs`
    {{#power-calendar selected=selected center=center as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the `center`, no on the `selected` date');
  assert.equal(this.$('.ember-power-calendar-day[data-date="2016-02-29"]').length, 1, 'The days in the calendar actually belong to the displayed month');
  assert.equal(this.$('.ember-power-calendar-day--selected').length, 1, 'There is one day marked as selected');
  assert.equal(this.$('.ember-power-calendar-day--selected').data('date'), '2016-03-05', 'The passed `selected` is the selected day');
});

test('The days that belong to the currently displayed month have a distintive class that the days belonging to the previous/next month don\'t', function(assert) {
  assert.expect(4);
  this.render(hbs`
    {{#power-calendar as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-01"]').hasClass('ember-power-calendar-day--current-month'), 'Days of the current month have this class');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-31"]').hasClass('ember-power-calendar-day--current-month'), 'Days of the current month have this class');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-09-30"]').hasClass('ember-power-calendar-day--current-month'), 'Days of the previous month don\'t');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-11-01"]').hasClass('ember-power-calendar-day--current-month'), 'Days of the previous month don\'t');
});

test('The current day has a special class that other days don\'t', function(assert) {
  assert.expect(3);
  this.render(hbs`
    {{#power-calendar as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-18"]').hasClass('ember-power-calendar-day--today'), 'The current day has a special class');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-19"]').hasClass('ember-power-calendar-day--today'));
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-17"]').hasClass('ember-power-calendar-day--today'));
});

test('It shows the abbreviation of the week-days starting on Monday', function(assert) {
  assert.expect(1);
  this.render(hbs`
    {{#power-calendar as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  assert.equal(this.$('.ember-power-calendar-weekdays').text().replace(/\s+/g, ' ').trim(), 'Mon Tue Wed Thu Fri Sat Sun');
});

test('If there is no `onSelect` action, days cannot be focused', function(assert) {
  assert.expect(1);
  this.render(hbs`
    {{#power-calendar as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  let $dayElement = this.$('.ember-power-calendar-day[data-date="2013-10-18"]');
  run(() => $dayElement.focus());
  assert.notEqual(document.activeElement, $dayElement.get(0));
});

test('If there is an `onSelect` action, days can be focused', function(assert) {
  assert.expect(1);
  this.render(hbs`
    {{#power-calendar onSelect=(action (mut foo)) as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  let $dayElement = this.$('.ember-power-calendar-day[data-date="2013-10-18"]');
  run(() => $dayElement.focus());
  assert.equal(document.activeElement, $dayElement.get(0));
});

test('If a day is focused, it gets a special hasClass', function(assert) {
  assert.expect(3);
  this.render(hbs`
    {{#power-calendar onSelect=(action (mut foo)) as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  let $dayElement = this.$('.ember-power-calendar-day[data-date="2013-10-18"]');
  run(() => $dayElement.focus());
  assert.ok($dayElement.hasClass('ember-power-calendar-day--focused'), 'The focused day gets a special class');
  let $anotherDayElement = this.$('.ember-power-calendar-day[data-date="2013-10-21"]');
  run(() => $anotherDayElement.focus());
  assert.notOk($dayElement.hasClass('ember-power-calendar-day--focused'), 'The focused day gets a special class');
  assert.ok($anotherDayElement.hasClass('ember-power-calendar-day--focused'), 'The focused day gets a special class');
});

test('Clicking one day, triggers the `onSelect` action with that day (which is a object with some basic information)', function(assert) {
  assert.expect(2);
  this.didChange = function(day, e) {
    assert.isDay(day, 'The first argument is a day object');
    assert.ok(e instanceof Event, 'The second argument is an event');
  };
  this.render(hbs`
    {{#power-calendar onSelect=(action didChange) as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
  let dayElement = this.$('.ember-power-calendar-day[data-date="2013-10-18"]').get(0);
  run(() => dayElement.click());
});

test('If the `onSelect` updates the selected value, it can work as a date-selector', function(assert) {
  assert.expect(2);
  this.selected = new Date(2016, 1, 5);
  this.render(hbs`
    {{#power-calendar selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);

  assert.equal(this.$('.ember-power-calendar-day--selected').data('date'), '2016-02-05');
  run(() => this.$('.ember-power-calendar-day[data-date="2016-02-21"]').click());
  assert.equal(this.$('.ember-power-calendar-day--selected').data('date'), '2016-02-21');
});

test('If a day is focused, using left/right arrow keys focuses the previous/next day', function(assert) {
  assert.expect(6);
  this.render(hbs`
    {{#power-calendar onSelect=(action (mut selected) value="date") as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);

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
  this.render(hbs`
    {{#power-calendar onSelect=(action (mut selected) value="date") as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);
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

test('If the `onCenterChange` action returns a `thenable`, the component enter loading state while that thenable resolves or rejects', function(assert) {
  assert.expect(2);
  let done = assert.async();
  this.asyncAction = function() {
    return new RSVP.Promise(function(resolve) {
      run.later(resolve, 200);
    });
  };
  this.render(hbs`
    {{#power-calendar onCenterChange=(action asyncAction) as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar}}
  `);

  setTimeout(function() {
    assert.ok(this.$('.ember-power-calendar').hasClass('ember-power-calendar--loading'), 'The component is in a loading state');
  }, 100);

  run(() => this.$('.ember-power-calendar-nav-control--next').click());

  setTimeout(function() {
    assert.notOk(this.$('.ember-power-calendar').hasClass('ember-power-calendar--loading'), 'The component is not in a loading state anymore');
    done();
  }, 250);
});

test('If the calendar without `onSelect` receives a block on the `days` component, that block is used to render each one of the days of the cell', function(assert) {
  assert.expect(1);
  this.render(hbs`
    {{#power-calendar as |calendar|}}
      {{#calendar.days as |day|}}
        {{day.number}}!
      {{/calendar.days}}
    {{/power-calendar}}
  `);
  assert.equal(this.$('.ember-power-calendar-day[data-date="2013-10-01"]').text().trim(), '1!', 'The block has been rendered');
});

test('If the calendar with `onSelect` receives a block on the `days` component, that block is used to render each one of the days of the cell', function(assert) {
  assert.expect(1);
  this.render(hbs`
    {{#power-calendar selected=day onSelect=(action (mut day) value="date") as |calendar|}}
      {{#calendar.days as |day|}}
        {{day.number}}!
      {{/calendar.days}}
    {{/power-calendar}}
  `);
  assert.equal(this.$('.ember-power-calendar-day[data-date="2013-10-01"]').text().trim(), '1!', 'The block has been rendered');
});