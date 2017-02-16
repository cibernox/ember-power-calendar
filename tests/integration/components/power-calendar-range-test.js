import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../assertions';
import getOwner from 'ember-owner/get';
import run from 'ember-runloop';
import moment from 'moment';

moduleForComponent('power-calendar-range', 'Integration | Component | power calendar range', {
  integration: true,
  beforeEach() {
    let calendarService = getOwner(this).lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    assertionInjector(this);
  },

  afterEach() {
    assertionCleanup(this);
  }
});

test('when it receives a range in the `selected` argument containing `Date` objects, the range is highlighted', function(assert) {
  assert.expect(4);
  this.selected = { start: new Date(2016, 1, 5), end: new Date(2016, 1, 9) };
  this.render(hbs`
    {{#power-calendar-range selected=selected as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar-range}}
  `);
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
  this.render(hbs`
    {{#power-calendar-range selected=selected onSelect=(action didChange) as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar-range}}
  `);

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
  assert.equal(numberOfCalls, 2, 'The onSelect action was called twice');
});

test('In range calendars, clicking first the end of the range and then the start is not a problem', function(assert) {
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
  this.render(hbs`
    {{#power-calendar-range selected=selected onSelect=(action didChange) as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar-range}}
  `);

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
  assert.equal(numberOfCalls, 2, 'The onSelect action was called twice');
});

test('Passing `minRange` allows to determine the minimum length of a range (in days)', function(assert) {
  assert.expect(10);
  this.render(hbs`
    {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") minRange=3 as |cal|}}
      {{cal.nav}}
      {{cal.days}}
    {{/power-calendar-range}}
  `);

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-10"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').prop('disabled'), 'The clicked day is disabled');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-11"]').prop('disabled'), 'The next day is disabled');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-12"]').prop('disabled'), 'The next-next day is disabled too');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-13"]').prop('disabled'), 'The next-next-next day is enabled');

  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-09"]').prop('disabled'), 'The prev day is disabled');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-08"]').prop('disabled'), 'The prev-prev day is disabled too');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-07"]').prop('disabled'), 'The prev-prev-prev day is enabled');

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-12"]').get(0).click());
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-12"]').hasClass('ember-power-calendar-day--selected'), 'Clicking a day not long enough didn\'t select anything');
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-13"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-13"]').hasClass('ember-power-calendar-day--selected'), 'Clicking outside the range select it');
  let allDaysInBetweenAreSelected = this.$('.ember-power-calendar-day[data-date="2013-10-11"]').hasClass('ember-power-calendar-day--selected')
    && this.$('.ember-power-calendar-day[data-date="2013-10-12"]').hasClass('ember-power-calendar-day--selected');
  assert.ok(allDaysInBetweenAreSelected, 'the 11th and 12th day are selected');
});

test('Passing `minRange=0` allows to make a range start and end on the same date', function(assert) {
  assert.expect(7);
  this.render(hbs`
    {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") minRange=0 as |cal|}}
      {{cal.nav}}
      {{cal.days}}
    {{/power-calendar-range}}
  `);

  assert.equal(this.$('.ember-power-calendar-day--selected').length, 0, 'No days have been selected');
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-10"]').get(0).click());
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').prop('disabled'), 'The clicked day is still enabled');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--selected'), 'The clicked date is selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--range-start'), 'The clicked date is the start of the range');

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-10"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--selected'), 'The clicked date is selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--range-start'), 'The clicked date is the start of the range');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--range-end'), 'The clicked date is also the end of the range');
});

test('The default minRange is one day, but it can be changed passing convenient strings', function(assert) {
  assert.expect(4);
  this.render(hbs`
    {{#power-calendar-range minRange=minRange as |calendar|}}
      <div class="formatted-min-range">{{moment-duration calendar.minRange}}</div>
    {{/power-calendar-range}}
  `);

  assert.equal(this.$('.formatted-min-range').text().trim(), 'a day', 'the default minRange is one day');
  run(() => this.set('minRange', 3));
  assert.equal(this.$('.formatted-min-range').text().trim(), '3 days', 'when passed a number, it is interpreted as number of days');
  run(() => this.set('minRange', '1 week'));
  assert.equal(this.$('.formatted-min-range').text().trim(), '7 days', 'it can regognize humanized durations');
  run(() => this.set('minRange', '1m'));
  assert.equal(this.$('.formatted-min-range').text().trim(), 'a minute', 'it can regognize humanized durations that use abbreviations');
});

test('Passing `maxRange` allows to determine the minimum length of a range (in days)', function(assert) {
  assert.expect(9);
  this.render(hbs`
    {{#power-calendar-range selected=selected onSelect=(action (mut selected) value="date") maxRange=2 as |cal|}}
      {{cal.nav}}
      {{cal.days}}
    {{/power-calendar-range}}
  `);

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-10"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').prop('disabled'), 'The clicked day is disabled');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-11"]').prop('disabled'), 'The next day is enabled');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-12"]').prop('disabled'), 'The next-next day is enabled too');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-13"]').prop('disabled'), 'The next-next-next day is disabled');

  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-09"]').prop('disabled'), 'The prev day is enabled');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-08"]').prop('disabled'), 'The prev-prev day is enabled too');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-07"]').prop('disabled'), 'The prev-prev-prev day is disabled');

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-12"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-12"]').hasClass('ember-power-calendar-day--selected'));
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-11"]').hasClass('ember-power-calendar-day--selected'), 'the 11th is selected');
});

test('If `publicAPI.action.select` does not invoke the `onSelect` action if the range is smaller than the minRange', function(assert) {
  assert.expect(2);
  this.selected = { start: new Date(2016, 1, 5), end: null };
  this.invalidDay = { date: new Date(2016, 1, 6), moment: moment(new Date(2016, 1, 6)) };
  this.validDay = { date: new Date(2016, 1, 8), moment: moment(new Date(2016, 1, 8)) };
  let range;
  this.didSelect = function(r) {
    range = r;
  };
  this.render(hbs`
    {{#power-calendar-range selected=selected onSelect=didSelect minRange=2 as |cal|}}
      <button id="select-invalid-range-end" onclick={{action cal.actions.select invalidDay}}>Select invalid date</button>
      <button id="select-valid-range-end" onclick={{action cal.actions.select validDay}}>Select valid date</button>
    {{/power-calendar-range}}
  `);
  run(() => this.$('#select-invalid-range-end').get(0).click());
  assert.equal(range, undefined, 'The actions has not been called');
  run(() => this.$('#select-valid-range-end').get(0).click());
  assert.notEqual(range, undefined, 'The actions has been called now');
});

test('If `publicAPI.action.select` does not invoke the `onSelect` action if the range is bigger than the maxRange', function(assert) {
  assert.expect(2);
  this.selected = { start: new Date(2016, 1, 5), end: null };
  this.validDay = { date: new Date(2016, 1, 6), moment: moment(new Date(2016, 1, 6)) };
  this.invalidDay = { date: new Date(2016, 1, 8), moment: moment(new Date(2016, 1, 8)) };
  let range;
  this.didSelect = function(r) {
    range = r;
  };
  this.render(hbs`
    {{#power-calendar-range selected=selected onSelect=didSelect maxRange=2 as |cal|}}
      <button id="select-invalid-range-end" onclick={{action cal.actions.select invalidDay}}>Select invalid date</button>
      <button id="select-valid-range-end" onclick={{action cal.actions.select validDay}}>Select valid date</button>
    {{/power-calendar-range}}
  `);
  run(() => this.$('#select-invalid-range-end').get(0).click());
  assert.equal(range, undefined, 'The actions has not been called');
  run(() => this.$('#select-valid-range-end').get(0).click());
  assert.notEqual(range, undefined, 'The actions has been called now');
});
