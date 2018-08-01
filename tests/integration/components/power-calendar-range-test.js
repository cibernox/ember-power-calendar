import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../assertions';
import { run } from '@ember/runloop';
import { find, click } from 'ember-native-dom-helpers';

module('Integration | Component | power calendar range', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    let calendarService = this.owner.lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    assertionInjector(this);
  });

  hooks.afterEach(function() {
    assertionCleanup(this);
  });

  test('when it receives a range in the `selected` argument containing `Date` objects, the range is highlighted', async function(assert) {
    assert.expect(4);
    this.selected = { start: new Date(2016, 1, 5), end: new Date(2016, 1, 9) };
    await render(hbs`
      {{#power-calendar-range selected=selected as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar-range}}
    `);
    assert.ok(find('.ember-power-calendar-nav').textContent.trim().indexOf('February 2016') > -1, 'The calendar is centered in the month of the selected date');
    let allDaysInRangeAreSelected = find('.ember-power-calendar-day[data-date="2016-02-05"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2016-02-06"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2016-02-07"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2016-02-08"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2016-02-09"]').classList.contains('ember-power-calendar-day--selected');
    assert.ok(allDaysInRangeAreSelected, 'All days in range are selected');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-05"]').classList.contains('ember-power-calendar-day--range-start'), 'The start of the range has a special class');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-09"]').classList.contains('ember-power-calendar-day--range-end'), 'The end of the range has a special class');
  });

  test('In range calendars, clicking a day selects one end of the range, and clicking another closes the range', async function(assert) {
    this.selected = null;
    let numberOfCalls = 0;
    this.didChange = (range, calendar, e) => {
      numberOfCalls++;
      if (numberOfCalls === 1) {
        assert.ok(range.date.start, 'The start is present');
        assert.notOk(range.date.end, 'The end is not present');
      } else {
        assert.ok(range.date.start, 'The start is present');
        assert.ok(range.date.end, 'The start is also present');
      }
      this.set('selected', range.date);
      assert.isCalendar(calendar, 'The second argument is the calendar\'s public API');
      assert.ok(e instanceof Event, 'The third argument is an event');
    };
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=(action didChange) as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar-range}}
    `);

    assert.notOk(find('.ember-power-calendar-day--selected'), 'No days have been selected');
    await click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--selected'), 'The clicked date is selected');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--range-start'), 'The clicked date is the start of the range');
    await click('.ember-power-calendar-day[data-date="2013-10-15"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--selected'), 'The first clicked date is still selected');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--range-start'), 'The first clicked date is still the start of the range');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--selected'), 'The clicked date is selected');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--range-end'), 'The clicked date is the start of the range');
    let allDaysInBetweenAreSelected = find('.ember-power-calendar-day[data-date="2013-10-11"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2013-10-12"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2013-10-13"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2013-10-14"]').classList.contains('ember-power-calendar-day--selected');
    assert.ok(allDaysInBetweenAreSelected, 'All days in between are also selected');
    assert.equal(numberOfCalls, 2, 'The onSelect action was called twice');
  });

  test('In range calendars, clicking first the end of the range and then the start is not a problem', async function(assert) {
    this.selected = null;
    let numberOfCalls = 0;
    this.didChange = (range, calendar, e) => {
      numberOfCalls++;
      if (numberOfCalls === 1) {
        assert.ok(range.date.start, 'The start is present');
        assert.notOk(range.date.end, 'The end is not present');
      } else {
        assert.ok(range.date.start, 'The start is present');
        assert.ok(range.date.end, 'The start is also present');
      }
      this.set('selected', range.date);
      assert.isCalendar(calendar, 'The second argument is the calendar\'s public API');
      assert.ok(e instanceof Event, 'The third argument is an event');
    };
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=(action didChange) as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar-range}}
    `);

    assert.notOk(find('.ember-power-calendar-day--selected'), 'No days have been selected');
    click('.ember-power-calendar-day[data-date="2013-10-15"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--selected'), 'The clicked date is selected');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--range-start'), 'The clicked date is the start of the range');
    click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--selected'), 'The first clicked date is still selected');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--range-start'), 'The first clicked date is still the start of the range');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--selected'), 'The clicked date is selected');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--range-end'), 'The clicked date is the start of the range');
    let allDaysInBetweenAreSelected = find('.ember-power-calendar-day[data-date="2013-10-11"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2013-10-12"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2013-10-13"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2013-10-14"]').classList.contains('ember-power-calendar-day--selected');
    assert.ok(allDaysInBetweenAreSelected, 'All days in between are also selected');
    assert.equal(numberOfCalls, 2, 'The onSelect action was called twice');
  });

  test('Passing `minRange` allows to determine the minimum length of a range (in days)', async function(assert) {
    assert.expect(10);
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") minRange=3 as |cal|}}
        {{cal.nav}}
        {{cal.days}}
      {{/power-calendar-range}}
    `);

    click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').disabled, 'The clicked day is disabled');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-11"]').disabled, 'The next day is disabled');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-12"]').disabled, 'The next-next day is disabled too');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-13"]').disabled, 'The next-next-next day is enabled');

    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-09"]').disabled, 'The prev day is disabled');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-08"]').disabled, 'The prev-prev day is disabled too');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-07"]').disabled, 'The prev-prev-prev day is enabled');

    click('.ember-power-calendar-day[data-date="2013-10-12"]');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-12"]').classList.contains('ember-power-calendar-day--selected'), 'Clicking a day not long enough didn\'t select anything');
    click('.ember-power-calendar-day[data-date="2013-10-13"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-13"]').classList.contains('ember-power-calendar-day--selected'), 'Clicking outside the range select it');
    let allDaysInBetweenAreSelected = find('.ember-power-calendar-day[data-date="2013-10-11"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2013-10-12"]').classList.contains('ember-power-calendar-day--selected');
    assert.ok(allDaysInBetweenAreSelected, 'the 11th and 12th day are selected');
  });

  test('Passing `minRange=0` allows to make a range start and end on the same date', async function(assert) {
    assert.expect(7);
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") minRange=0 as |cal|}}
        {{cal.nav}}
        {{cal.days}}
      {{/power-calendar-range}}
    `);

    assert.notOk(find('.ember-power-calendar-day--selected'), 'No days have been selected');
    click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-10"]').disabled, 'The clicked day is still enabled');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--selected'), 'The clicked date is selected');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--range-start'), 'The clicked date is the start of the range');

    click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--selected'), 'The clicked date is selected');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--range-start'), 'The clicked date is the start of the range');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').classList.contains('ember-power-calendar-day--range-end'), 'The clicked date is also the end of the range');
  });

  test('The default minRange is one day, but it can be changed passing convenient strings', async function(assert) {
    assert.expect(4);
    await render(hbs`
      {{#power-calendar-range minRange=minRange as |calendar|}}
        <div class="formatted-min-range">{{calendar.minRange}}</div>
      {{/power-calendar-range}}
    `);

    assert.equal(find('.formatted-min-range').textContent.trim(), '86400000', 'the default minRange is one day');
    run(() => this.set('minRange', 3));
    assert.equal(find('.formatted-min-range').textContent.trim(), '259200000', 'when passed a number, it is interpreted as number of days');
    run(() => this.set('minRange', '1 week'));
    assert.equal(find(".formatted-min-range").textContent.trim(), "604800000", "it can regognize humanized durations");
    run(() => this.set('minRange', '1m'));
    assert.equal(find('.formatted-min-range').textContent.trim(), '60000', 'it can regognize humanized durations that use abbreviations');
  });

  test('Passing `maxRange` allows to determine the minimum length of a range (in days)', async function(assert) {
    assert.expect(9);
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") maxRange=2 as |cal|}}
        {{cal.nav}}
        {{cal.days}}
      {{/power-calendar-range}}
    `);

    click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-10"]').disabled, 'The clicked day is disabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-11"]').disabled, 'The next day is enabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-12"]').disabled, 'The next-next day is enabled too');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-13"]').disabled, 'The next-next-next day is disabled');

    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-09"]').disabled, 'The prev day is enabled');
    assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-08"]').disabled, 'The prev-prev day is enabled too');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-07"]').disabled, 'The prev-prev-prev day is disabled');

    click('.ember-power-calendar-day[data-date="2013-10-12"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-12"]').classList.contains('ember-power-calendar-day--selected'));
    assert.ok(find('.ember-power-calendar-day[data-date="2013-10-11"]').classList.contains('ember-power-calendar-day--selected'), 'the 11th is selected');
  });

  test('If `publicAPI.action.select` does not invoke the `onSelect` action if the range is smaller than the minRange', async function(assert) {
    assert.expect(2);
    this.selected = { start: new Date(2016, 1, 5), end: null };
    this.invalidDay = { date: new Date(2016, 1, 6), };
    this.validDay = { date: new Date(2016, 1, 8), };
    let range;
    this.didSelect = function(r) {
      range = r;
    };
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=didSelect minRange=2 as |cal|}}
        <button id="select-invalid-range-end" onclick={{action cal.actions.select invalidDay}}>Select invalid date</button>
        <button id="select-valid-range-end" onclick={{action cal.actions.select validDay}}>Select valid date</button>
      {{/power-calendar-range}}
    `);
    click('#select-invalid-range-end');
    assert.equal(range, undefined, 'The actions has not been called');
    click('#select-valid-range-end');
    assert.notEqual(range, undefined, 'The actions has been called now');
  });

  test('If `publicAPI.action.select` does not invoke the `onSelect` action if the range is bigger than the maxRange', async function(assert) {
    assert.expect(2);
    this.selected = { start: new Date(2016, 1, 5), end: null };
    this.validDay = { date: new Date(2016, 1, 6) };
    this.invalidDay = { date: new Date(2016, 1, 8) };
    let range;
    this.didSelect = function(r) { range = r; };
    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=didSelect maxRange=2 as |cal|}}
        <button id="select-invalid-range-end" onclick={{action cal.actions.select invalidDay}}>Select invalid date</button>
        <button id="select-valid-range-end" onclick={{action cal.actions.select validDay}}>Select valid date</button>
      {{/power-calendar-range}}
    `);
    click('#select-invalid-range-end');
    assert.equal(range, undefined, 'The actions has not been called');
    click('#select-valid-range-end');
    assert.notEqual(range, undefined, 'The actions has been called now');
  });

  test('when is flagged as proximitySelection it changes range to closest date', async function(assert) {
    assert.expect(7);
    this.selected = { start: new Date(2016, 1, 5), end: new Date(2016, 1, 9) };
    this.proximitySelection = true;

    await render(hbs`
      {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") proximitySelection=true as |calendar|}}
        {{calendar.nav}}
        {{calendar.days}}
      {{/power-calendar-range}}
    `);
    let allDaysInRangeAreSelected = find('.ember-power-calendar-day[data-date="2016-02-05"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2016-02-06"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2016-02-07"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2016-02-08"]').classList.contains('ember-power-calendar-day--selected')
      && find('.ember-power-calendar-day[data-date="2016-02-09"]').classList.contains('ember-power-calendar-day--selected');
    assert.ok(allDaysInRangeAreSelected, 'All days in range are selected');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-05"]').classList.contains('ember-power-calendar-day--range-start'), 'The start of the range has a special class');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-09"]').classList.contains('ember-power-calendar-day--range-end'), 'The end of the range has a special class');
    click('.ember-power-calendar-day[data-date="2016-02-10"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-05"]').classList.contains('ember-power-calendar-day--range-start'), 'The start of the range has a special class');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-10"]').classList.contains('ember-power-calendar-day--range-end'), 'The end of the range has a special class');
    click('.ember-power-calendar-day[data-date="2016-02-04"]');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-04"]').classList.contains('ember-power-calendar-day--range-start'), 'The start of the range has a special class');
    assert.ok(find('.ember-power-calendar-day[data-date="2016-02-10"]').classList.contains('ember-power-calendar-day--range-end'), 'The end of the range has a special class');
  });
});
