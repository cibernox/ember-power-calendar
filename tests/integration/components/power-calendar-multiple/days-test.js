import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { find, click } from 'ember-native-dom-helpers';

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
  }
);
