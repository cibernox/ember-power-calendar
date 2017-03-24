import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import getOwner from 'ember-owner/get';
import { find, click } from 'ember-native-dom-helpers';

moduleForComponent('power-calendar-multiple/days', 'Integration | Component | power-calendar-multiple/days', {
  integration: true,
  beforeEach() {
    let calendarService = getOwner(this).lookup('service:power-calendar');
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
  click('.ember-power-calendar-day[data-date="2013-10-05"]');
  assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-05"]').disabled);
  assert.ok(find('.ember-power-calendar-day[data-date="2013-10-06"]').disabled);

  click('.ember-power-calendar-day[data-date="2013-10-05"]');
  assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-05"]').disabled);
  assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-06"]').disabled);
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
  click('.ember-power-calendar-day[data-date="2013-10-05"]');
  assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-05"]').disabled);
  assert.ok(find('.ember-power-calendar-day[data-date="2013-10-06"]').disabled);

  this.set('max', 2);
  assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-06"]').disabled);
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
  click('.ember-power-calendar-day[data-date="2013-10-05"]');
  this.set('collection', null);
  assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-06"]').disabled);
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
  click('.ember-power-calendar-day[data-date="2013-10-05"]');

  assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-06"]').disabled);
});
