import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { calendarSelect } from 'ember-power-calendar/test-support';
import { find } from 'ember-native-dom-helpers';

module('Test Support | Helper | calendarSelect', function(hooks) {
  setupRenderingTest(hooks);

  test('`calendarSelect` selects the given date ', async function(assert) {
    this.center4 = new Date(2013, 9, 18);
    this.selected4 = new Date(2013, 9, 15);
    await render(hbs`
      <div class="calendar-select-1">
        {{#power-calendar
          center=center4
          selected=selected4
          onSelect=(action (mut selected4) value="date")
          onCenterChange=(action (mut center4) value="date") as |calendar|}}
          {{calendar.nav}}
          {{calendar.days}}
        {{/power-calendar}}
      </div>
    `);

    assert.equal(find('.calendar-select-1 .ember-power-calendar-nav-title').textContent.trim(), 'October 2013');
    assert.ok(find('.calendar-select-1 [data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--selected'), 'The 15th is selected');
    await calendarSelect('.calendar-select-1', new Date(2013, 9, 11));

    assert.ok(find('.calendar-select-1 [data-date="2013-10-11"]').classList.contains('ember-power-calendar-day--selected'), 'The 11th of October is selected');
  });

  test('`calendarSelect` selects the given date changing the month center on the process', async function(assert) {
    this.center4 = new Date(2013, 9, 18);
    this.selected4 = new Date(2013, 9, 15);
    await render(hbs`
      <div class="calendar-select-1">
        {{#power-calendar
          center=center4
          selected=selected4
          onSelect=(action (mut selected4) value="date")
          onCenterChange=(action (mut center4) value="date") as |calendar|}}
          {{calendar.nav}}
          {{calendar.days}}
        {{/power-calendar}}
      </div>
    `);

    assert.equal(find('.calendar-select-1 .ember-power-calendar-nav-title').textContent.trim(), 'October 2013');
    assert.ok(find('.calendar-select-1 [data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--selected'), 'The 15th is selected');
    await calendarSelect('.calendar-select-1', new Date(2013, 8, 3));

    assert.equal(find('.calendar-select-1 .ember-power-calendar-nav-title').textContent.trim(), 'September 2013', 'The nav component has updated');
    assert.ok(find('.calendar-select-1 [data-date="2013-09-01"]'), 'The days component has updated');
    assert.ok(find('.calendar-select-1 [data-date="2013-09-03"]').classList.contains('ember-power-calendar-day--selected'), 'The 3rd of september is selected');
  });
});
