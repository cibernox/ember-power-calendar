import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../assertions';
import { run } from '@ember/runloop';
import { isSame } from 'ember-power-calendar/utils/date-utils';
// import moment from 'moment';
import { find, click } from 'ember-native-dom-helpers';

module('Integration | Component | power calendar multiple', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    let calendarService = this.owner.lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    assertionInjector(this);
  });

  hooks.afterEach(function() {
    assertionCleanup(this);
  });

  test('When a multiple calendar receives an array of dates, those dates are marked as selected', async function(assert) {
    assert.expect(5);
    this.selected = [new Date(2016, 1, 5), new Date(2016, 1, 9), new Date(2016, 1, 15)];

    await render(hbs`
      {{#power-calendar-multiple selected=selected as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar-multiple}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('February 2016') > -1, 'The calendar is centered in the month of the first selected date');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-05"]').classList.contains('ember-power-calendar-day--selected'), 'The first selected day is selected');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-09"]').classList.contains('ember-power-calendar-day--selected'), 'The second selected day is selected');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-15"]').classList.contains('ember-power-calendar-day--selected'), 'The third selected day is selected');
    assert.notOk(find('.ember-power-calendar-day[data-date="2016-02-08"]').classList.contains('ember-power-calendar-day--selected'), 'The days in between those aren\'t day is selected');
  });

  test('When days are clicked in a multiple calendar, the `onSelect` action is called with the acumulated list of days, in the order they were clicked', async function(assert) {
    let callsCount = 0;
    this.didChange = (days, calendar, e) => {
      callsCount++;
      if (callsCount === 1) {
        assert.equal(days.date.length, 1);
        assert.ok(isSame(days.date[0], new Date('2013-10-05'), 'day'));
      } else if (callsCount === 2) {
        assert.equal(days.date.length, 2);
        assert.ok(isSame(days.date[0], new Date('2013-10-05'), 'day'));
        assert.ok(isSame(days.date[1], new Date('2013-10-15'), 'day'));
      } else if (callsCount === 3) {
        assert.equal(days.date.length, 3);
        assert.ok(isSame(days.date[0], new Date('2013-10-05'), 'day'));
        assert.ok(isSame(days.date[1], new Date('2013-10-15'), 'day'));
        assert.ok(isSame(days.date[2], new Date('2013-10-09'), 'day'));
      } else {
        assert.equal(days.date.length, 2);
        assert.ok(isSame(days.date[0], new Date('2013-10-05'), 'day'));
        assert.ok(isSame(days.date[1], new Date('2013-10-09'), 'day'));
      }
      assert.isCalendar(calendar, 'The second argument is the calendar\'s public API');
      assert.ok(e instanceof Event, 'The third argument is an event');
      this.set('selected', days.date);
    };

    await render(hbs`
      {{#power-calendar-multiple selected=selected onSelect=(action didChange) as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar-multiple}}
    `);

    assert.notOk(find('.ember-power-calendar-day--selected'), 'No days are selected');

    click('.ember-power-calendar-day[data-date="2013-10-05"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-05"]').classList.contains('ember-power-calendar-day--selected'));

    click('.ember-power-calendar-day[data-date="2013-10-15"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-05"]').classList.contains('ember-power-calendar-day--selected'));
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--selected'));

    click('.ember-power-calendar-day[data-date="2013-10-09"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-05"]').classList.contains('ember-power-calendar-day--selected'));
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--selected'));
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-09"]').classList.contains('ember-power-calendar-day--selected'));

    click('.ember-power-calendar-day[data-date="2013-10-15"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-05"]').classList.contains('ember-power-calendar-day--selected'));
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--selected'));
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-09"]').classList.contains('ember-power-calendar-day--selected'));
  });

  test('Clicking on a day selects it, and clicking again on it unselects it', async function(assert) {
    assert.expect(13);
    await render(hbs`
      {{#power-calendar-multiple selected=selected onSelect=(action (mut selected) value="moment") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar-multiple}}
    `);
    assert.notOk(find('.ember-power-calendar-day--selected'), 'No days are selected');

    click('.ember-power-calendar-day[data-date="2013-10-05"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-05"]').classList.contains('ember-power-calendar-day--selected'));

    click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-05"]').classList.contains('ember-power-calendar-day--selected'));
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--selected'));

    click('.ember-power-calendar-day[data-date="2013-10-12"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-05"]').classList.contains('ember-power-calendar-day--selected'));
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--selected'));
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-12"]').classList.contains('ember-power-calendar-day--selected'));
    assert.equal(this.get('selected')[0].format('YYYY-MM-DD'), '2013-10-05');
    assert.equal(this.get('selected')[1].format('YYYY-MM-DD'), '2013-10-10');
    assert.equal(this.get('selected')[2].format('YYYY-MM-DD'), '2013-10-12');

    click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert.equal(this.get('selected')[0].format('YYYY-MM-DD'), '2013-10-05');
    assert.equal(this.get('selected')[1].format('YYYY-MM-DD'), '2013-10-12');

    click('.ember-power-calendar-day[data-date="2013-10-12"]');
    click('.ember-power-calendar-day[data-date="2013-10-05"]');
    assert.notOk(find('.ember-power-calendar-day--selected'), 'No days are selected');
  });

  test('If the user passes `disabledDates=someDate` to multiple calendars, days on those days are disabled', async function(assert) {
    assert.expect(13);
    this.disabledDates = [
      new Date(2013, 9, 15),
      new Date(2013, 9, 17),
      new Date(2013, 9, 21),
      new Date(2013, 9, 23)
    ];
    await render(hbs`
      {{#power-calendar-multiple selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days disabledDates=disabledDates}}
      {{/power-calendar-multiple}}
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
  });
});
