import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';
import getOwner from 'ember-owner/get';

moduleForComponent('power-calendar-multiple/days', 'Integration | Component | power calendar multiple/days', {
  integration: true,
  beforeEach() {
    let calendarService = getOwner(this).lookup('service:power-calendar-clock');
    calendarService.set('date', new Date(2013, 9, 18));
  }
});

test('The maxLength property sets a maximum number of available days', function(assert) {
  this.render(hbs`
    {{#power-calendar-multiple
      selected=collection
      onSelect=(action (mut collection) value="moment") as |calendar|}}
      {{calendar.days maxLength=1}}
    {{/power-calendar-multiple}}
  `);
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-05"]').get(0).click());
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-05"]').is(':disabled'));
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-06"]').is(':disabled'));

  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-05"]').get(0).click());
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-05"]').is(':disabled'));
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-06"]').is(':disabled'));
});

test('the maxLength property can handle changing of the property', function(assert) {
  this.set('max', 1);
  this.render(hbs`
    {{#power-calendar-multiple
      selected=collection
      onSelect=(action (mut collection) value="moment") as |calendar|}}
      {{calendar.days maxLength=max}}
    {{/power-calendar-multiple}}
  `);
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-05"]').get(0).click());
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-05"]').is(':disabled'));
  assert.ok(this.$('.ember-power-calendar-day[data-date="2013-10-06"]').is(':disabled'));

  this.set('max', 2);
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-06"]').is(':disabled'));
});

test('maxLength can handle null for the selected days', function(assert) {
  this.set('max', 1);
  this.set('collection', null);

  this.render(hbs`
    {{#power-calendar-multiple
      selected=collection
      onSelect=(action (mut collection) value="moment") as |calendar|}}
      {{calendar.days maxLength=max}}
    {{/power-calendar-multiple}}
  `);
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-05"]').get(0).click());
  this.set('collection', null);
  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-06"]').is(':disabled'));
});

test('maxLength can handle null for the maxLength property', function(assert) {
  this.set('max', null);

  this.render(hbs`
    {{#power-calendar-multiple
      selected=collection
      onSelect=(action (mut collection) value="moment") as |calendar|}}
      {{calendar.days maxLength=max}}
    {{/power-calendar-multiple}}
  `);
  run(() => this.$('.ember-power-calendar-day[data-date="2013-10-05"]').get(0).click());

  assert.notOk(this.$('.ember-power-calendar-day[data-date="2013-10-06"]').is(':disabled'));
});
