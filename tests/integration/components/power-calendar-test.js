import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../assertions';
import { run, later } from '@ember/runloop';
import RSVP from 'rsvp';
import { find, click, keyEvent, focus } from 'ember-native-dom-helpers';
import moment from 'moment';

module('Integration | Component | Power Calendar', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    assertionInjector(this);
    let calendarService = this.owner.lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
  });

  hooks.afterEach(function() {
    assertionCleanup(this);
  });

  test('Rendered without any arguments, it displays the current month and has no month navigation', async function(assert) {
    assert.expect(3);
    await render(hbs`
      {{#power-calendar as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('October 2013') > -1, 'The calendar is centered in the present');
    assert.notOk(find('.ember-power-calendar-nav-control'), 'There is no controls to navigate months');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-01"]'), 'The days in the calendar actually belong to the presnet month');
  });

  test('when rendered without a block, it renders the nav and days components', async function(assert) {
    assert.expect(2);
    await render(hbs`{{power-calendar}}`);
    assert.ok(find('.ember-power-calendar-nav'));
    assert.ok(find('.ember-power-calendar-day'));
  });

  test('when it receives a Date in the `center` argument, it displays that month', async function(assert) {
    assert.expect(3);
    this.center = new Date(2016, 1, 5);
    await render(hbs`
      {{#power-calendar center=center as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('February 2016') > -1, 'The calendar is centered in the the passed month');
    assert.notOk(find('.ember-power-calendar-nav-control'), 'There is no controls to navigate months');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-29"]'), 'The days in the calendar actually belong to the displayed month');
  });

  test('when it receives null in the `center` argument, it displays the current month', async function(assert) {
    assert.expect(3);
    this.center = null;
    await render(hbs`
      {{#power-calendar center=center as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('October 2013') > -1, 'The calendar is centered in the the current month');
    assert.notOk(find('.ember-power-calendar-nav-control'), 'There is no controls to navigate months');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-26"]'), 'The days in the calendar actually belong to the displayed month');
  });

  test('when it receives undefined in the `center` argument, it displays the current month', async function(assert) {
    assert.expect(3);
    this.center = undefined;
    await render(hbs`
      {{#power-calendar center=center as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('October 2013') > -1, 'The calendar is centered in the the current month');
    assert.notOk(find('.ember-power-calendar-nav-control'), 'There is no controls to navigate months');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-26"]'), 'The days in the calendar actually belong to the displayed month');
  });

  test('when it receives a `moment()` in the `center` argument, it displays that month', async function(assert) {
    assert.expect(3);
    this.center = moment('2016-02-05');
    await render(hbs`
      {{#power-calendar center=center as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('February 2016') > -1, 'The calendar is centered in the the passed month');
    assert.notOk(find('.ember-power-calendar-nav-control'), 'There is no controls to navigate months');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-29"]'), 'The days in the calendar actually belong to the displayed month');
  });

  test('when it receives a `center` and an `onCenterChange` action, it shows controls to go to the next & previous month and the action is called when they are clicked', async function(assert) {
    assert.expect(7);
    this.center = new Date(2016, 1, 5);
    this.moveCenter = function() {
      assert.ok(true, 'The moveCenter action is invoked');
    };
    await render(hbs`
      {{#power-calendar center=center onCenterChange=moveCenter as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('February 2016') > -1, 'The calendar is centered in the the passed month');
    assert.ok(find('.ember-power-calendar-nav-control--previous'), 'There is a control to go to previous month');
    assert.ok(find('.ember-power-calendar-nav-control--next'), 'There is a control to go to next month');

    click('.ember-power-calendar-nav-control--previous');
    click('.ember-power-calendar-nav-control--next');
    click('.ember-power-calendar-nav-control--next');

    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('February 2016') > -1, 'The calendar is still centered in the the passed month');
  });

  test('when the `onCenterChange` action changes the `center` attribute, the calendar shows the new month', async function(assert) {
    assert.expect(2);
    this.center = new Date(2016, 1, 5);
    await render(hbs`
      {{#power-calendar center=center onCenterChange=(action (mut center) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('February 2016') > -1, 'The calendar is centered in the the passed month');

    click('.ember-power-calendar-nav-control--next');

    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('March 2016') > -1, 'The calendar is now centered in the the next month');
  });

  test('when the `onCenterChange` action changes the `center` and the passed center was null, the calendar shows the new month', async function(assert) {
    assert.expect(2);
    this.center = null;
    await render(hbs`
      {{#power-calendar center=center onCenterChange=(action (mut center) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('October 2013') > -1, 'The calendar is centered in the the current month');

    click('.ember-power-calendar-nav-control--next');

    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('November 2013') > -1, 'The calendar is now centered in the the next month');
  });

  test('the `onCenterChange` action receives the date/moment compound object, the calendar and the event', async function(assert) {
    assert.expect(3);
    this.center = new Date(2016, 1, 5);
    this.onCenterChange = function(obj, calendar, e) {
      assert.ok(obj.hasOwnProperty('moment') && obj.hasOwnProperty('date'), 'The first argument is a compound moment/date object');
      assert.isCalendar(calendar, 'The second argument is the calendar\'s public API');
      assert.ok(e instanceof Event, 'The third argument is an event');
    };
    await render(hbs`
      {{#power-calendar center=center onCenterChange=onCenterChange as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);

    click('.ember-power-calendar-nav-control--next');
  });

  test('when it receives a Date in the `selected` argument, it displays that month, and that day is marked as selected', async function(assert) {
    assert.expect(4);
    this.selected = new Date(2016, 1, 5);
    await render(hbs`
      {{#power-calendar selected=selected as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('February 2016') > -1, 'The calendar is centered in the month of the selected date');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-29"]'), 'The days in the calendar actually belong to the displayed month');
    assert.ok(find('.ember-power-calendar-day--selected'), 'There is one day marked as selected');
    assert.equal(find('.ember-power-calendar-day--selected').dataset.date, '2016-02-05', 'The passed `selected` is the selected day');
  });

  test('when it receives a `moment` in the `selected` argument, it displays that month, and that day is marked as selected', async function(assert) {
    assert.expect(4);
    this.selected = moment('2016-02-05');
    await render(hbs`
      {{#power-calendar selected=selected as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('February 2016') > -1, 'The calendar is centered in the month of the selected date');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-29"]'), 'The days in the calendar actually belong to the displayed month');
    assert.ok(find('.ember-power-calendar-day--selected'), 'There is one day marked as selected');
    assert.equal(find('.ember-power-calendar-day--selected').dataset.date, '2016-02-05', 'The passed `selected` is the selected day');
  });

  test('when it receives both `selected` and `center`, `center` trumps and that month is displayed', async function(assert) {
    assert.expect(4);
    this.selected = new Date(2016, 2, 5);
    this.center = new Date(2016, 1, 5);
    await render(hbs`
      {{#power-calendar selected=selected center=center as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('February 2016') > -1, 'The calendar is centered in the `center`, no on the `selected` date');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-29"]'), 'The days in the calendar actually belong to the displayed month');
    assert.ok(find('.ember-power-calendar-day--selected'), 'There is one day marked as selected');
    assert.equal(find('.ember-power-calendar-day--selected').dataset.date, '2016-03-05', 'The passed `selected` is the selected day');
  });

  test('The days that belong to the currently displayed month have a distintive class that the days belonging to the previous/next month don\'t', async function(assert) {
    assert.expect(4);
    await render(hbs`
      {{#power-calendar as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-01"]').classList.contains('ember-power-calendar-day--current-month'), 'Days of the current month have this class');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-31"]').classList.contains('ember-power-calendar-day--current-month'), 'Days of the current month have this class');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-09-30"]').classList.contains('ember-power-calendar-day--current-month'), 'Days of the previous month don\'t');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-11-01"]').classList.contains('ember-power-calendar-day--current-month'), 'Days of the previous month don\'t');
  });

  test('The current day has a special class that other days don\'t', async function(assert) {
    assert.expect(3);
    await render(hbs`
      {{#power-calendar as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-18"]').classList.contains('ember-power-calendar-day--today'), 'The current day has a special class');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-19"]').classList.contains('ember-power-calendar-day--today'));
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-17"]').classList.contains('ember-power-calendar-day--today'));
  });

  test('If there is no `onSelect` action, days cannot be focused', async function(assert) {
    assert.expect(1);
    await render(hbs`
      {{#power-calendar as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    let dayElement = find('.ember-power-calendar-day[data-date="2013-10-18"]');
    focus(dayElement);
    assert.notEqual(document.activeElement, dayElement);
  });

  test('If there is an `onSelect` action, days can be focused', async function(assert) {
    assert.expect(1);
    await render(hbs`
      {{#power-calendar onSelect=(action (mut foo)) as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    let dayElement = find('.ember-power-calendar-day[data-date="2013-10-18"]');
    focus(dayElement);
    assert.equal(document.activeElement, dayElement);
  });

  test('If a day is focused, it gets a special hasClass', async function(assert) {
    assert.expect(3);
    await render(hbs`
      {{#power-calendar onSelect=(action (mut foo)) as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    let dayElement = find('.ember-power-calendar-day[data-date="2013-10-18"]');
    focus(dayElement);
    assert.ok(dayElement.classList.contains('ember-power-calendar-day--focused'), 'The focused day gets a special class');
    let anotherDayElement = find('.ember-power-calendar-day[data-date="2013-10-21"]');
    focus(anotherDayElement);
    assert.notOk(dayElement.classList.contains('ember-power-calendar-day--focused'), 'The focused day gets a special class');
    assert.ok(anotherDayElement.classList.contains('ember-power-calendar-day--focused'), 'The focused day gets a special class');
  });

  test('Clicking one day, triggers the `onSelect` action with that day (which is a object with some basic information)', async function(assert) {
    assert.expect(3);
    this.didChange = function(day, calendar, e) {
      assert.isDay(day, 'The first argument is a day object');
      assert.isCalendar(calendar, 'The second argument is the calendar\'s public API');
      assert.ok(e instanceof Event, 'The third argument is an event');
    };
    await render(hbs`
      {{#power-calendar onSelect=(action didChange) as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    click('.ember-power-calendar-day[data-date="2013-10-18"]');
  });

  test('If the `onSelect` updates the selected value, it can work as a date-selector', async function(assert) {
    assert.expect(2);
    this.selected = new Date(2016, 1, 5);
    await render(hbs`
      {{#power-calendar selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);

    assert.equal(find('.ember-power-calendar-day--selected').dataset.date, '2016-02-05');
    click('.ember-power-calendar-day[data-date="2016-02-21"]');
    assert.equal(find('.ember-power-calendar-day--selected').dataset.date, '2016-02-21');
  });

  test('If a day is focused, using left/right arrow keys focuses the previous/next day', async function(assert) {
    assert.expect(6);
    await render(hbs`
      {{#power-calendar onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);

    focus('.ember-power-calendar-day[data-date="2013-10-18"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-18"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-18"]'));

    keyEvent('.ember-power-calendar-day[data-date="2013-10-18"]', 'keydown', 37); // left arrow
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-17"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-17"]'));

    keyEvent('.ember-power-calendar-day[data-date="2013-10-17"]', 'keydown', 39); // right arrow
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-18"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-18"]'));
  });

  test('If a day is focused, using up/down arrow keys focuses the same weekday of the previous/next week', async function(assert) {
    assert.expect(6);
    await render(hbs`
      {{#power-calendar onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);
    focus('.ember-power-calendar-day[data-date="2013-10-18"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-18"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-18"]'));

    keyEvent('.ember-power-calendar-day[data-date="2013-10-18"]', 'keydown', 38); // left arrow
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-11"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-11"]'));

    keyEvent('.ember-power-calendar-day[data-date="2013-10-17"]', 'keydown', 40); // right arrow
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-18"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-18"]'));
  });

  test('If the `onCenterChange` action returns a `thenable`, the component enter loading state while that thenable resolves or rejects', async function(assert) {
    assert.expect(2);
    let done = assert.async();
    this.asyncAction = function() {
      return new RSVP.Promise(function(resolve) {
        later(resolve, 200);
      });
    };
    await render(hbs`
      {{#power-calendar onCenterChange=(action asyncAction) as |calendar|}}
        <div class={{if calendar.loading 'is-loading-yo'}}></div>
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar}}
    `);

    setTimeout(function() {
      assert.ok(find('.is-loading-yo'), 'The component is in a loading state');
    }, 100);

    click('.ember-power-calendar-nav-control--next');

    setTimeout(function() {
      assert.notOk(find('.is-loading-yo'), 'The component is not in a loading state anymore');
      done();
    }, 250);
  });

  test('If the calendar without `onSelect` receives a block on the `days` component, that block is used to render each one of the days of the cell', async function(assert) {
    assert.expect(1);
    await render(hbs`
      {{#power-calendar as |calendar|}}
        {{#calendar.days as |day|}}
          {{day.number}}!
        {{/calendar.days}}
      {{/power-calendar}}
    `);
    assert.equal(find('.ember-power-calendar-day[data-date="2013-10-01"]').textContent.trim(), '1!', 'The block has been rendered');
  });

  test('If the calendar with `onSelect` receives a block on the `days` component, that block is used to render each one of the days of the cell', async function(assert) {
    assert.expect(1);
    await render(hbs`
      {{#power-calendar selected=day onSelect=(action (mut day) value="date") as |calendar|}}
        {{#calendar.days as |day|}}
          {{day.number}}!
        {{/calendar.days}}
      {{/power-calendar}}
    `);
    assert.equal(find('.ember-power-calendar-day[data-date="2013-10-01"]').textContent.trim(), '1!', 'The block has been rendered');
  });

  test('If the user passes `minDate=someDate` to single calendars, days before that one cannot be selected, but that day and those after can', async function(assert) {
    assert.expect(6);
    this.minDate = new Date(2013, 9, 15);
    await render(hbs`
      {{#power-calendar selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days minDate=minDate}}
      {{/power-calendar}}
    `);

    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-14"]').disabled, 'Days before the minDate are disabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-15"]').disabled, 'The minDate is selectable');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-16"]').disabled, 'Days after the minDate are selectable');

    run(() => this.set('minDate', new Date(2013, 9, 18)));
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-14"]').disabled, 'Days before the minDate are disabled');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-17"]').disabled, 'The minDate is selectable');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-18"]').disabled, 'Days after the minDate are selectable');
  });

  test('If the user passes `maxDate=someDate` to single calendars, days after that one cannot be selected, but that day and those days before can', async function(assert) {
    assert.expect(6);
    this.maxDate = new Date(2013, 9, 15);
    await render(hbs`
      {{#power-calendar selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days maxDate=maxDate}}
      {{/power-calendar}}
    `);

    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-14"]').disabled, 'Days before the minDate are selectable');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-15"]').disabled, 'The maxDate is selectable');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-16"]').disabled, 'Days after the maxDate are disabled');

    run(() => this.set('maxDate', new Date('2013-10-18')));
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-14"]').disabled, 'Days before the minDate are selectable');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-18"]').disabled, 'The maxDate is selectable');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-19"]').disabled, 'Days after the maxDate are disabled');
  });

  test('If the user passes `minDate=someDate` to range calendars, days before that one cannot be selected, but that day and those after can', async function(assert) {
    assert.expect(3);
    this.minDate = new Date(2013, 9, 15);
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days minDate=minDate}}
      {{/power-calendar-range}}
    `);

    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-14"]').disabled, 'Days before the minDate are disabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-15"]').disabled, 'The minDate is selectable');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-16"]').disabled, 'Days after the minDate are selectable');
  });

  test('If the user passes `maxDate=someDate` to range calendars, days after that one cannot be selected, but that day and those days before can', async function(assert) {
    assert.expect(3);
    this.maxDate = new Date(2013, 9, 15);
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days maxDate=maxDate}}
      {{/power-calendar-range}}
    `);

    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-14"]').disabled, 'Days before the minDate are selectable');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-15"]').disabled, 'The maxDate is selectable');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-16"]').disabled, 'Days after the maxDate are disabled');
  });

  test('If the user passes `disabledDates=someDate` to single calendars, days on those days are disabled', async function(assert) {
    assert.expect(20);
    this.disabledDates = [
      new Date(2013, 9, 15),
      new Date(2013, 9, 17),
      new Date(2013, 9, 21),
      new Date(2013, 9, 23)
    ];
    await render(hbs`
      {{#power-calendar selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days disabledDates=disabledDates}}
      {{/power-calendar}}
    `);

    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-14"]').disabled, 'The 14th is enabled');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').disabled, 'The 15th is disabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-14"]').disabled, 'The 16th is enabled');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-17"]').disabled, 'The 17th is disabled');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-21"]').disabled, 'The 21st is disabled');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-23"]').disabled, 'The 23rd is disabled');

    run(() => this.set('disabledDates', [new Date(2013, 9, 22)]));
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-14"]').disabled, 'The 14th is enabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-15"]').disabled, 'The 15th is enabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-14"]').disabled, 'The 16th is enabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-17"]').disabled, 'The 17th is enabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-21"]').disabled, 'The 21st is enabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-23"]').disabled, 'The 23rd is enabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-23"]').disabled, 'The 22nd is disabled');

    run(() => this.set('disabledDates', [new Date(2013, 9, 22), 'Tue', 'Thu', 'Sun']));
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-14"]').disabled, 'The 14th is enabled');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').disabled, 'The 15th is disabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-14"]').disabled, 'The 16th is enabled');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-17"]').disabled, 'The 17th is disabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-21"]').disabled, 'The 21st is enabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-23"]').disabled, 'The 23rd is enabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-23"]').disabled, 'The 22nd is disabled');
  });

  test('When the user tries to focus a disabled date with the left arrow key, the focus stays where it is', async function(assert) {
    assert.expect(4);
    this.minDate = new Date(2013, 9, 15);
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days minDate=minDate}}
      {{/power-calendar-range}}
    `);

    focus('.ember-power-calendar-day[data-date="2013-10-15"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-15"]'));

    keyEvent('.ember-power-calendar-day[data-date="2013-10-15"]', 'keydown', 37); // left arrow
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-15"]'));
  });

  test('When the user tries to focus a disabled date with the up arrow key, the focus goes to the latest selectable day', async function(assert) {
    assert.expect(4);
    this.minDate = new Date(2013, 9, 15);
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days minDate=minDate}}
      {{/power-calendar-range}}
    `);

    focus('.ember-power-calendar-day[data-date="2013-10-18"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-18"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-18"]'));

    keyEvent('.ember-power-calendar-day[data-date="2013-10-18"]', 'keydown', 38); // up arrow
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-15"]'));
  });

  test('When the user tries to focus a disabled date with the right arrow key, the focus stays where it is', async function(assert) {
    assert.expect(4);
    this.maxDate = new Date(2013, 9, 15);
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days maxDate=maxDate}}
      {{/power-calendar-range}}
    `);

    focus('.ember-power-calendar-day[data-date="2013-10-15"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-15"]'));

    keyEvent('.ember-power-calendar-day[data-date="2013-10-15"]', 'keydown', 39); // right arrow
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-15"]'));
  });

  test('When the user tries to focus a disabled date with the down arrow key, the focus goes to the latest selectable day', async function(assert) {
    assert.expect(4);
    this.maxDate = new Date(2013, 9, 15);
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days maxDate=maxDate}}
      {{/power-calendar-range}}
    `);

    focus('.ember-power-calendar-day[data-date="2013-10-11"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-11"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-11"]'));

    keyEvent('.ember-power-calendar-day[data-date="2013-10-11"]', 'keydown', 40); // down arrow
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--focused'));
    assert.equal(document.activeElement, find('.ember-power-calendar-day[data-date="2013-10-15"]'));
  });
});
