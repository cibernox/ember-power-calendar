import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module(
  'Integration | Component | power-calendar-multiple/months',
  function(hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function() {
      let calendarService = this.owner.lookup('service:power-calendar');
      calendarService.set('date', new Date(2013, 9));
    });

    test('The maxLength property sets a maximum number of available months', async function(assert) {
      await render(hbs`
        {{#power-calendar-multiple
          selected=collection
          onSelect=(action (mut collection) value="date") as |calendar|}}
          {{calendar.months maxLength=1}}
        {{/power-calendar-multiple}}
      `);
      await click('.ember-power-calendar-month[data-date="2013-04"]');
      assert.dom('.ember-power-calendar-month[data-date="2013-04"]').isNotDisabled();
      assert.dom('.ember-power-calendar-month[data-date="2013-05"]').isDisabled();

      await click('.ember-power-calendar-month[data-date="2013-04"]');
      assert.dom('.ember-power-calendar-month[data-date="2013-05"]').isNotDisabled();
      assert.dom('.ember-power-calendar-month[data-date="2013-06"]').isNotDisabled();
    });

    test('the maxLength property can handle changing of the property', async function(assert) {
      this.set('max', 1);
      await render(hbs`
        {{#power-calendar-multiple
          selected=collection
          onSelect=(action (mut collection) value="date") as |calendar|}}
          {{calendar.months maxLength=max}}
        {{/power-calendar-multiple}}
      `);
      await click('.ember-power-calendar-month[data-date="2013-05"]');
      assert.dom('.ember-power-calendar-month[data-date="2013-05"]').isNotDisabled();
      assert.dom('.ember-power-calendar-month[data-date="2013-06"]').isDisabled();

      this.set('max', 2);
      assert.dom('.ember-power-calendar-month[data-date="2013-06"]').isNotDisabled();
    });

    test('maxLength can handle null for the selected months', async function(assert) {
      this.set('max', 1);
      this.set('collection', null);

      await render(hbs`
        {{#power-calendar-multiple
          selected=collection
          onSelect=(action (mut collection) value="date") as |calendar|}}
          {{calendar.months maxLength=max}}
        {{/power-calendar-multiple}}
      `);
      await click('.ember-power-calendar-month[data-date="2013-05"]');
      this.set('collection', null);
      assert.dom('.ember-power-calendar-month[data-date="2013-06"]').isNotDisabled();
    });

    test('maxLength can handle null for the maxLength property', async function(assert) {
      this.set('max', null);

      await render(hbs`
        {{#power-calendar-multiple
          selected=collection
          onSelect=(action (mut collection) value="date") as |calendar|}}
          {{calendar.months maxLength=max}}
        {{/power-calendar-multiple}}
      `);
      await click('.ember-power-calendar-month[data-date="2013-05"]');

      assert.dom('.ember-power-calendar-month[data-date="2013-06"]').isNotDisabled();
    });
  }
);
