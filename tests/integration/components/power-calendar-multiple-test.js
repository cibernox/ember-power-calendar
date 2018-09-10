import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../assertions';
import { run } from '@ember/runloop';
import { isSame, formatDate } from 'ember-power-calendar-utils';

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

  test('When a multiple calendar receives an array of day dates, those days are marked as selected', async function(assert) {
    assert.expect(5);
    this.selected = [new Date(2016, 1, 5), new Date(2016, 1, 9), new Date(2016, 1, 15)];

    await render(hbs`
      {{#power-calendar-multiple selected=selected as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar-multiple}}
    `);
    assert.dom('.ember-power-calendar-nav').containsText('February 2016', 'The calendar is centered in the month of the first selected date');
    assert.dom('.ember-power-calendar-day[data-date="2016-02-05"]').hasClass('ember-power-calendar-day--selected', 'The first selected day is selected');
    assert.dom('.ember-power-calendar-day[data-date="2016-02-09"]').hasClass(
      'ember-power-calendar-day--selected',
      'The second selected day is selected'
    );
    assert.dom('.ember-power-calendar-day[data-date="2016-02-15"]').hasClass('ember-power-calendar-day--selected', 'The third selected day is selected');
    assert.dom('.ember-power-calendar-day[data-date="2016-02-08"]').hasNoClass(
      'ember-power-calendar-day--selected',
      'The days in between those aren\'t day is selected'
    );
  });

  test('When a multiple calendar receives an array of year dates, those years are marked as selected', async function(assert) {
    assert.expect(5);
    this.selected = [new Date(2016, 0), new Date(2017, 0), new Date(2020, 0)];

    await render(hbs`
      {{#power-calendar-multiple selected=selected as |calendar|}}
        {{calendar.nav by='decade'}}
        {{calendar.years}}
      {{/power-calendar-multiple}}
    `);
    assert.dom('.ember-power-calendar-nav').containsText('2010\'s', 'The calendar is centered in the decade of the first selected date');
    assert.dom('.ember-power-calendar-year[data-date="2016"]').hasClass(
      'ember-power-calendar-year--selected', 
      'The first selected year is selected'
    );
    assert.dom('.ember-power-calendar-year[data-date="2017"]').hasClass(
      'ember-power-calendar-year--selected',
      'The second selected year is selected'
    );
    assert.dom('.ember-power-calendar-year[data-date="2018"]').hasNoClass(
      'ember-power-calendar-year--selected', 
      'The third selected year is selected'
    );
    assert.dom('.ember-power-calendar-year[data-date="2020"]').hasClass(
      'ember-power-calendar-year--selected',
      'The years in between those aren\'t year is selected'
    );
  });

  test('When days are clicked in a multiple calendar, the `onSelect` action is called with the acumulated list of days, in the order they were clicked', async function(assert) {
    let callsCount = 0;
    this.didChange = (days, calendar, e) => {
      callsCount++;
      if (callsCount === 1) {
        assert.equal(days.date.length, 1, 'one is selected');
        assert.ok(isSame(days.date[0], new Date(2013, 9, 5), 'day'), '2013-10-05 is selected');
      } else if (callsCount === 2) {
        assert.equal(days.date.length, 2, 'two are selected');
        assert.ok(isSame(days.date[0], new Date(2013, 9, 5), 'day'), '2013-10-05 is selected');
        assert.ok(isSame(days.date[1], new Date(2013, 9, 15), 'day'), '2013-10-15 is selected');
      } else if (callsCount === 3) {
        assert.equal(days.date.length, 3, 'three are selected');
        assert.ok(isSame(days.date[0], new Date(2013, 9, 5), 'day'), '2013-10-05 is selected');
        assert.ok(isSame(days.date[1], new Date(2013, 9, 15), 'day'), '2013-10-15 is selected');
        assert.ok(isSame(days.date[2], new Date(2013, 9, 9), 'day'), '2013-10-09 is selected');
      } else {
        assert.equal(days.date.length, 2, 'two are selected');
        assert.ok(isSame(days.date[0], new Date(2013, 9, 5), 'day'), '2013-10-05 is selected');
        assert.ok(isSame(days.date[1], new Date(2013, 9, 9), 'day'), '2013-10-15 is selected');
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

    assert.dom('.ember-power-calendar-day--selected').doesNotExist('No days are selected');

    await click('.ember-power-calendar-day[data-date="2013-10-05"]');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected');

    await click('.ember-power-calendar-day[data-date="2013-10-15"]');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-15"]').hasClass('ember-power-calendar-day--selected');

    await click('.ember-power-calendar-day[data-date="2013-10-09"]');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-15"]').hasClass('ember-power-calendar-day--selected');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-09"]').hasClass('ember-power-calendar-day--selected');

    await click('.ember-power-calendar-day[data-date="2013-10-15"]');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-15"]').hasNoClass('ember-power-calendar-day--selected');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-09"]').hasClass('ember-power-calendar-day--selected');
  });

  test('Clicking on a day selects it, and clicking again on it unselects it', async function(assert) {
    assert.expect(13);
    await render(hbs`
      {{#power-calendar-multiple selected=selected onSelect=(action (mut selected) value="date") as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar-multiple}}
    `);
    assert.dom('.ember-power-calendar-day--selected').doesNotExist('No days are selected');

    await click('.ember-power-calendar-day[data-date="2013-10-05"]');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected');

    await click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--selected');

    await click('.ember-power-calendar-day[data-date="2013-10-12"]');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--selected');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-12"]').hasClass('ember-power-calendar-day--selected');
    assert.equal(formatDate(this.get('selected')[0], 'YYYY-MM-DD'), '2013-10-05');
    assert.equal(formatDate(this.get('selected')[1], 'YYYY-MM-DD'), '2013-10-10');
    assert.equal(formatDate(this.get('selected')[2], 'YYYY-MM-DD'), '2013-10-12');

    await click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert.equal(formatDate(this.get('selected')[0], 'YYYY-MM-DD'), '2013-10-05');
    assert.equal(formatDate(this.get('selected')[1], 'YYYY-MM-DD'), '2013-10-12');

    await click('.ember-power-calendar-day[data-date="2013-10-12"]');
    await click('.ember-power-calendar-day[data-date="2013-10-05"]');
    assert.dom('.ember-power-calendar-day--selected').doesNotExist('No days are selected');
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

    assert.dom('.ember-power-calendar-day[data-date="2013-10-14"]').isNotDisabled('The 14th is enabled');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-15"]').isDisabled('The 15th is disabled');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-16"]').isNotDisabled('The 16th is enabled');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-17"]').isDisabled('The 17th is disabled');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-21"]').isDisabled('The 21st is disabled');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-23"]').isDisabled('The 23rd is disabled');

    run(() => this.set('disabledDates', [new Date(2013, 9, 22)]));
    assert.dom('.ember-power-calendar-day[data-date="2013-10-14"]').isNotDisabled('The 14th is enabled');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-15"]').isNotDisabled('The 15th is enabled');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-14"]').isNotDisabled('The 16th is enabled');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-17"]').isNotDisabled('The 17th is enabled');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-21"]').isNotDisabled('The 21st is enabled');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-23"]').isNotDisabled('The 23rd is enabled');
    assert.dom('.ember-power-calendar-day[data-date="2013-10-22"]').isDisabled('The 22nd is disabled');
  });
});
