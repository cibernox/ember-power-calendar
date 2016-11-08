import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import getOwner from 'ember-owner/get';
import run from 'ember-runloop';

moduleForComponent('power-calendar-range', 'Integration | Component | power calendar range', {
  integration: true,
  beforeEach() {
    let calendarService = getOwner(this).lookup('service:power-calendar-clock');
    calendarService.set('date', new Date(2013, 9, 18));
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

test('The start and end of the range can be the same day', function(assert) {
  this.range = null;
  this.render(hbs`
    {{#power-calendar-range selected=range onSelect=(action (mut range) value="moment") as |cal|}}
      {{cal.nav}}
      {{cal.days}}
    {{/power-calendar-range}}
  `);

  assert.equal(this.$('.ember-power-calendar-day--selected').length, 0, 'No days have been selected');
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-10"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--selected'), 'The clicked date is selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--range-start'), 'The clicked date is the start of the range');
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-10"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--selected'), 'The first clicked date is still selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--range-start'), 'The first clicked date is still the start of the range');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--range-end'), 'The same day is also the end');
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