import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, type TestContext } from '@ember/test-helpers';
import HelpersTesting from '../../demo-app/components/helpers-testing';
import { calendarCenter, calendarSelect } from '#src/test-support/helpers.ts';
import HostWrapper from '../../demo-app/components/host-wrapper.gts';
import { getRootNode } from '../helpers';

interface ExtendedTestContext extends TestContext {
  element: HTMLElement;
}

module('Acceptance | helpers | calendarCenter', function (hooks) {
  setupRenderingTest(hooks);

  test<ExtendedTestContext>('`calendarCenter` invokes the `@onCenterChange` action of the target component inside the selector we pass it', async function (assert) {
    await render(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
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

  test<ExtendedTestContext>('`calendarCenter` invokes the `@onCenterChange` action of the target component WITH the selector we pass it', async function (assert) {
    await render(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.calendar-center-2-calendar .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('October 2013');
    await calendarCenter(
      '.calendar-center-2-calendar',
      new Date(2013, 8, 3),
      getRootNode(this.element),
    );

    assert
      .dom(
        '.calendar-center-2-calendar .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('September 2013', 'The nav component has updated');
    assert
      .dom(
        '.calendar-center-2-calendar [data-date="2013-09-01"]',
        getRootNode(this.element),
      )
      .exists('The days component has updated');
  });

  test<ExtendedTestContext>('`calendarCenter` throws an error if called on a calendar without `@onCenterChange` action', async function (assert) {
    assert.expect(2);
    await render(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.calendar-center-3 .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('October 2013');
    return calendarCenter(
      '.calendar-center-3',
      new Date(2013, 8, 3),
      getRootNode(this.element),
    ).catch((error) => {
      assert.strictEqual(
        (error as Error).message,
        "Assertion Failed: You cannot call `calendarCenter` on a component that doesn't has an `@onCenterChange` action",
      );
    });
  });

  test<ExtendedTestContext>('`calendarCenter` throws an error it cannot find a calendar using the given selector', async function (assert) {
    assert.expect(1);
    await render(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    return calendarCenter(
      '.non-exister-selector',
      new Date(2013, 8, 3),
      getRootNode(this.element),
    ).catch((error) => {
      assert.strictEqual(
        (error as Error).message,
        'Assertion Failed: Could not find a calendar using selector: ".non-exister-selector"',
      );
    });
  });

  test<ExtendedTestContext>('`calendarCenter` works even if the calendar is tagless', async function (assert) {
    assert.expect(2);
    await render(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );
    await calendarCenter(
      '.calendar-center-4',
      new Date(2013, 8, 3),
      getRootNode(this.element),
    );

    assert
      .dom(
        '.calendar-center-4 .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('September 2013', 'The nav component has updated');
    assert
      .dom(
        '.calendar-center-4 [data-date="2013-09-01"]',
        getRootNode(this.element),
      )
      .exists('The days component has updated');
  });
});

module('Acceptance | helpers | calendarSelect', function (hooks) {
  setupRenderingTest(hooks);

  test<ExtendedTestContext>('`calendarSelect` selects the given date ', async function (assert) {
    await render(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.calendar-select-1 .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('October 2013');
    assert
      .dom(
        '.calendar-select-1 [data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--selected', 'The 15th is selected');
    await calendarSelect(
      '.calendar-select-1',
      new Date(2013, 9, 11),
      getRootNode(this.element),
    );

    assert
      .dom(
        '.calendar-select-1 [data-date="2013-10-11"]',
        getRootNode(this.element),
      )
      .hasClass(
        'ember-power-calendar-day--selected',
        'The 11th of October is selected',
      );
  });

  test<ExtendedTestContext>('`calendarSelect` selects the given date changing the month center on the process', async function (assert) {
    await render(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.calendar-select-1 .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('October 2013');
    assert
      .dom(
        '.calendar-select-1 [data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--selected', 'The 15th is selected');
    await calendarSelect(
      '.calendar-select-1',
      new Date(2013, 8, 3),
      getRootNode(this.element),
    );

    assert
      .dom(
        '.calendar-select-1 .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('September 2013', 'The nav component has updated');
    assert
      .dom(
        '.calendar-select-1 [data-date="2013-09-01"]',
        getRootNode(this.element),
      )
      .exists('The days component has updated');
    assert
      .dom(
        '.calendar-select-1 [data-date="2013-09-03"]',
        getRootNode(this.element),
      )
      .hasClass(
        'ember-power-calendar-day--selected',
        'The 3rd of september is selected',
      );
  });

  test<ExtendedTestContext>('`calendarSelect` selects the given date in wormhole', async function (assert) {
    await render(
      <template>
        <HostWrapper><HelpersTesting /></HostWrapper>
      </template>,
    );

    await click(
      getRootNode(this.element).querySelector(
        '.calendar-in-dropdown input',
      ) as HTMLElement,
    );
    assert
      .dom(
        '.dropdown-content .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('October 2013');
    assert
      .dom(
        '.dropdown-content [data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--selected', 'The 15th is selected');
    await calendarSelect(
      '.dropdown-content',
      new Date(2013, 8, 3),
      getRootNode(this.element),
    );

    assert
      .dom(
        '.dropdown-content .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('September 2013', 'The nav component has updated');
    assert
      .dom(
        '.dropdown-content [data-date="2013-09-01"]',
        getRootNode(this.element),
      )
      .exists('The days component has updated');
    assert
      .dom(
        '.dropdown-content [data-date="2013-09-03"]',
        getRootNode(this.element),
      )
      .hasClass(
        'ember-power-calendar-day--selected',
        'The 3rd of september is selected',
      );
  });
});
