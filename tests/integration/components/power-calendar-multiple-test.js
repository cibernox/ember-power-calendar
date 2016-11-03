import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import getOwner from 'ember-owner/get';
import run from 'ember-runloop';

moduleForComponent('power-calendar-multiple', 'Integration | Component | power calendar multiple', {
  integration: true,
  beforeEach() {
    let calendarService = getOwner(this).lookup('service:power-calendar-clock');
    calendarService.set('date', new Date(2013, 9, 18));
  }
});

test('When a multiple calendar receives an array of dates, those dates are marked as selected', function(assert) {
  assert.expect(5);
  this.selected = [new Date(2016, 1, 5), new Date(2016, 1, 9), new Date(2016, 1, 15)];

  this.render(hbs`
    {{#power-calendar-multiple selected=selected as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar-multiple}}
  `);
  assert.ok(this.$('.ember-power-calendar-nav').text().trim().indexOf('February 2016') > -1, 'The calendar is centered in the month of the first selected date');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2016-02-05"]').hasClass('ember-power-calendar-day--selected'), 'The first selected day is selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2016-02-09"]').hasClass('ember-power-calendar-day--selected'), 'The second selected day is selected');
  assert.ok(this.$('.ember-power-calendar-day[data-date="2016-02-15"]').hasClass('ember-power-calendar-day--selected'), 'The third selected day is selected');
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2016-02-08"]').hasClass('ember-power-calendar-day--selected'), 'The days in between those aren\'t day is selected');
});

test('When days are clicked in a multiple calendar, the `onSelect` action is called with the acumulated list of days, in the order they were clicked', function(assert) {
  let callsCount = 0;
  this.didChange = (days, e) => {
    callsCount++;
    if (callsCount === 1) {
      assert.equal(days.date.length, 1);
      assert.ok(days.moment[0].isSame(moment('2013-10-05'), 'day'));
    } else if (callsCount === 2) {
      assert.equal(days.date.length, 2);
      assert.ok(days.moment[0].isSame(moment('2013-10-05'), 'day'));
      assert.ok(days.moment[1].isSame(moment('2013-10-15'), 'day'));
    } else if (callsCount === 3) {
      assert.equal(days.date.length, 3);
      assert.ok(days.moment[0].isSame(moment('2013-10-05'), 'day'));
      assert.ok(days.moment[1].isSame(moment('2013-10-15'), 'day'));
      assert.ok(days.moment[2].isSame(moment('2013-10-09'), 'day'));
    } else {
      assert.equal(days.date.length, 2);
      assert.ok(days.moment[0].isSame(moment('2013-10-05'), 'day'));
      assert.ok(days.moment[1].isSame(moment('2013-10-09'), 'day'));
    }
    assert.ok(e instanceof Event, 'The second argument is an event');
    this.set('selected', days.date);
  };

  this.render(hbs`
    {{#power-calendar-multiple selected=selected onSelect=(action didChange) as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar-multiple}}
  `);

  assert.equal(this.$('.ember-power-calendar-day--selected').length, 0, 'No days are selected');

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-05"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected'));

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-15"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected'));
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-15"]').hasClass('ember-power-calendar-day--selected'));

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-09"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected'));
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-15"]').hasClass('ember-power-calendar-day--selected'));
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-09"]').hasClass('ember-power-calendar-day--selected'));

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-15"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected'));
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-15"]').hasClass('ember-power-calendar-day--selected'));
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-09"]').hasClass('ember-power-calendar-day--selected'));
});

test('Clicking on a day selects it, and clicking again on it unselects it', function(assert) {
  assert.expect(13);
  this.render(hbs`
    {{#power-calendar-multiple selected=selected onSelect=(action (mut selected) value="moment") as |calendar|}}
      {{calendar.nav}}
      {{calendar.days}}
    {{/power-calendar-multiple}}
  `);
  assert.equal(this.$('.ember-power-calendar-day--selected').length, 0, 'No days are selected');

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-05"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected'));

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-10"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected'));
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--selected'));

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-12"]').get(0).click());
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-05"]').hasClass('ember-power-calendar-day--selected'));
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-10"]').hasClass('ember-power-calendar-day--selected'));
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-12"]').hasClass('ember-power-calendar-day--selected'));
  assert.equal(this.get('selected')[0].format('YYYY-MM-DD'), '2013-10-05');
  assert.equal(this.get('selected')[1].format('YYYY-MM-DD'), '2013-10-10');
  assert.equal(this.get('selected')[2].format('YYYY-MM-DD'), '2013-10-12');

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-10"]').get(0).click());
  assert.equal(this.get('selected')[0].format('YYYY-MM-DD'), '2013-10-05');
  assert.equal(this.get('selected')[1].format('YYYY-MM-DD'), '2013-10-12');

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-12"]').get(0).click());
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-05"]').get(0).click());
  assert.equal(this.$('.ember-power-calendar-day--selected').length, 0, 'No days are selected');
});

