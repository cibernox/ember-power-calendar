import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import PowerCalendar from '#src/components/power-calendar.gts';
import {
  calendarCenter,
  type NormalizeCalendarValue,
} from '#src/test-support/helpers.ts';
import type { TestContext } from '@ember/test-helpers';
import type { PowerCalendarAPI } from '#src/components/power-calendar.gts';
import HostWrapper from '../../../demo-app/components/host-wrapper.gts';
import { getRootNode } from '../../helpers';

interface Context extends TestContext {
  element: HTMLElement;
  center1: Date;
  onCenterChange: (
    newCenter: NormalizeCalendarValue,
    calendar: PowerCalendarAPI,
    event: Event,
  ) => Promise<void> | void;
}

module('Test Support | Helper | calendarCenter', function (hooks) {
  setupRenderingTest(hooks);

  test<Context>('`calendarCenter` invokes the `@onCenterChange` action of the target component inside the selector we pass it', async function (assert) {
    const self = this;

    assert.expect(3);
    this.center1 = new Date(2013, 9, 18);
    this.onCenterChange = (selected) => {
      this.set('center1', selected.date);
    };

    await render<Context>(
      <template>
        <HostWrapper>
          <div class="calendar-center-1">
            <PowerCalendar
              @center={{self.center1}}
              @onCenterChange={{self.onCenterChange}}
              as |calendar|
            >
              <calendar.Nav />
              <calendar.Days />
            </PowerCalendar>
          </div>
        </HostWrapper>
      </template>,
    );
    assert
      .dom(
        '.calendar-center-1 .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('October 2013');

    await calendarCenter(
      '.calendar-center-1',
      new Date(2013, 8, 3),
      getRootNode(this.element),
    );
    assert
      .dom(
        '.calendar-center-1 .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('September 2013', 'The nav component has updated');
    assert
      .dom(
        '.calendar-center-1 [data-date="2013-09-01"]',
        getRootNode(this.element),
      )
      .exists('The days component has updated');
  });

  test<Context>('`calendarCenter` throws an error it cannot find a calendar using the given selector', async function (assert) {
    assert.expect(1);
    await render(
      <template>
        <HostWrapper>
          <div>No calendars!</div>
        </HostWrapper>
      </template>,
    );
    try {
      await calendarCenter(
        '.non-exister-selector',
        new Date(2013, 8, 3),
        getRootNode(this.element),
      );
    } catch (error) {
      assert.strictEqual(
        (error as Error).message,
        'Assertion Failed: Could not find a calendar using selector: ".non-exister-selector"',
      );
    }
  });
});
