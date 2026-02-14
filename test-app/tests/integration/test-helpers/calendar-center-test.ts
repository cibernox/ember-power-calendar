import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { calendarCenter, type NormalizeCalendarValue } from 'ember-power-calendar/test-support/helpers';
import type { TestContext } from '@ember/test-helpers';
import type { PowerCalendarAPI } from 'ember-power-calendar/components/power-calendar';

interface Context extends TestContext {
  center1: Date;
  onCenterChange: (newCenter: NormalizeCalendarValue, calendar: PowerCalendarAPI, event: Event) => Promise<void> | void;
}

module('Test Support | Helper | calendarCenter', function (hooks) {
  setupRenderingTest(hooks);

  test<Context>('`calendarCenter` invokes the `@onCenterChange` action of the target component inside the selector we pass it', async function (assert) {
    assert.expect(3);
    this.center1 = new Date(2013, 9, 18);
    this.onCenterChange = (selected) => {
      this.set('center1', selected.date);
    };

    await render<Context>(hbs`
      <div class="calendar-center-1">
        <PowerCalendar @center={{this.center1}} @onCenterChange={{this.onCenterChange}} as |calendar|>
          <calendar.Nav/>
          <calendar.Days/>
        </PowerCalendar>
      </div>
    `);
    assert
      .dom('.calendar-center-1 .ember-power-calendar-nav-title')
      .hasText('October 2013');

    await calendarCenter('.calendar-center-1', new Date(2013, 8, 3));
    assert
      .dom('.calendar-center-1 .ember-power-calendar-nav-title')
      .hasText('September 2013', 'The nav component has updated');
    assert
      .dom('.calendar-center-1 [data-date="2013-09-01"]')
      .exists('The days component has updated');
  });

  test<Context>('`calendarCenter` throws an error it cannot find a calendar using the given selector', async function (assert) {
    assert.expect(1);
    await render(hbs`<div>No calendars!</div>`);
    try {
      await calendarCenter('.non-exister-selector', new Date(2013, 8, 3));
    } catch (error) {
      assert.strictEqual(
        (error as Error).message,
        'Assertion Failed: Could not find a calendar using selector: ".non-exister-selector"',
      );
    }
  });
});
