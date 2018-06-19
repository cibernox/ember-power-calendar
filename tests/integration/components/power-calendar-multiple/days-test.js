import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { find, findAll, click } from 'ember-native-dom-helpers';

module(
  'Integration | Component | power-calendar-multiple/days',
  function(hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function() {
      let calendarService = this.owner.lookup('service:power-calendar');
      calendarService.set('date', new Date(2013, 9, 18));
    });

    test('The maxLength property sets a maximum number of available days', async function(assert) {
      await render(hbs`
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

    test('the maxLength property can handle changing of the property', async function(assert) {
      this.set('max', 1);
      await render(hbs`
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

    test('maxLength can handle null for the selected days', async function(assert) {
      this.set('max', 1);
      this.set('collection', null);

      await render(hbs`
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

    test('maxLength can handle null for the maxLength property', async function(assert) {
      this.set('max', null);

      await render(hbs`
        {{#power-calendar-multiple
          selected=collection
          onSelect=(action (mut collection) value="moment") as |calendar|}}
          {{calendar.days maxLength=max}}
        {{/power-calendar-multiple}}
      `);
      click('.ember-power-calendar-day[data-date="2013-10-05"]');

      assert.notOk(find('.ember-power-calendar-day[data-date="2013-10-06"]').disabled);
    });

    test('If it receives `showDaysAround=false` option, it doesn\'t show the days before first or after last day of the month', async function(assert) {
      assert.expect(3);

      await render(hbs`
        {{#power-calendar-multiple
          showDaysAround=false
          selected=collection
          onSelect=(action (mut collection) value="moment") as |calendar|}}
          {{calendar.days}}
        {{/power-calendar-multiple}}
      `);
      click('.ember-power-calendar-day[data-date="2013-10-05"]');

      let weeks = findAll('.ember-power-calendar-week');
      assert.equal(findAll('.ember-power-calendar-day', weeks[0]).length, 6, 'The first week has 6 days');
      assert.equal(weeks[0].dataset.missingDays, 1, 'It has a special data-attribute');
      assert.equal(findAll('.ember-power-calendar-day', weeks[4]).length, 4, 'The last week has 4 days');
    });
  }
);
