import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { calendarCenter } from 'ember-power-calendar/test-support';

module('Test Support | Helper | calendarCenter', function(hooks) {
  setupRenderingTest(hooks);

  test('`calendarCenter` invokes the `@onCenterChange` action of the target component inside the selector we pass it', async function(assert) {
    assert.expect(3);
    this.center1 = new Date(2013, 9, 18);

    await render(hbs`
      <div class="calendar-center-1">
        <PowerCalendar @center={{center1}} @onCenterChange={{action (mut center1) value="date"}} as |calendar|>
          <calendar.Nav/>
          <calendar.Days/>
        </PowerCalendar>
      </div>
    `);
    assert.dom('.calendar-center-1 .ember-power-calendar-nav-title').hasText('October 2013');

    await calendarCenter('.calendar-center-1', new Date(2013, 8, 3));
    assert.dom('.calendar-center-1 .ember-power-calendar-nav-title').hasText('September 2013', 'The nav component has updated');
    assert.dom('.calendar-center-1 [data-date="2013-09-01"]').exists('The days component has updated');
  });

  test('`calendarCenter` throws an error it cannot find a calendar using the given selector', async function(assert) {
    assert.expect(1);
    await render(hbs`<div>No calendars!</div>`);
    try {
      await calendarCenter('.non-exister-selector', new Date(2013, 8, 3));
    } catch(error) {
      assert.equal(error.message, 'Assertion Failed: Could not find a calendar using selector: ".non-exister-selector"');
    }
  });
});
