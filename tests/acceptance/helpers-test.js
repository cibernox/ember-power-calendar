import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, click } from '@ember/test-helpers';
import { calendarCenter, calendarSelect } from 'ember-power-calendar/test-support';

module('Acceptance | helpers | calendarCenter', function(hooks) {
  setupApplicationTest(hooks);

  test('`calendarCenter` invokes the `onCenterChange` action of the target component inside the selector we pass it', async function(assert) {
    await visit('/helpers-testing');
    assert.dom('.calendar-center-1 .ember-power-calendar-nav-title').hasText('October 2013');

    await calendarCenter('.calendar-center-1', new Date(2013, 8, 3));
    assert.dom('.calendar-center-1 .ember-power-calendar-nav-title').hasText('September 2013', 'The nav component has updated');
    assert.dom('.calendar-center-1 [data-date="2013-09-01"]').exists('The days component has updated');
  });

  test('`calendarCenter` invokes the `onCenterChange` action of the target component WITH the selector we pass it', async function(assert) {
    await visit('/helpers-testing');

    assert.dom('.calendar-center-2-calendar .ember-power-calendar-nav-title').hasText('October 2013');
    await calendarCenter('.calendar-center-2-calendar', new Date(2013, 8, 3));

    assert.dom('.calendar-center-2-calendar .ember-power-calendar-nav-title').hasText('September 2013', 'The nav component has updated');
    assert.dom('.calendar-center-2-calendar [data-date="2013-09-01"]').exists('The days component has updated');
  });

  test('`calendarCenter` throws an error if called on a calendar without `onCenterChange` action', async function(assert) {
    assert.expect(2);
    await visit('/helpers-testing');

    assert.dom('.calendar-center-3 .ember-power-calendar-nav-title').hasText('October 2013');
    return calendarCenter('.calendar-center-3', new Date(2013, 8, 3)).catch((error) => {
      assert.equal(error.message, 'Assertion Failed: You cannot call `calendarCenter` on a component that doesn\'t has an `onCenterChange` action');
    });
  });

  test('`calendarCenter` throws an error it cannot find a calendar using the given selector', async function(assert) {
    assert.expect(1);
    await visit('/helpers-testing');

    return calendarCenter('.non-exister-selector', new Date(2013, 8, 3)).catch((error) => {
      assert.equal(error.message, 'Assertion Failed: Could not find a calendar using selector: ".non-exister-selector"');
    });
  });

  test('`calendarCenter` works even if the calendar is tagless', async function(assert) {
    assert.expect(2);
    await visit('/helpers-testing');
    await calendarCenter('.calendar-center-4', new Date(2013, 8, 3));

    assert.dom('.calendar-center-4 .ember-power-calendar-nav-title').hasText('September 2013', 'The nav component has updated');
    assert.dom('.calendar-center-4 [data-date="2013-09-01"]').exists('The days component has updated');
  });
});

module('Acceptance | helpers | calendarSelect', function(hooks) {
  setupApplicationTest(hooks);

  test('`calendarSelect` selects the given date ', async function(assert) {
    await visit('/helpers-testing');

    assert.dom('.calendar-select-1 .ember-power-calendar-nav-title').hasText('October 2013');
    assert.dom('.calendar-select-1 [data-date="2013-10-15"]').hasClass('ember-power-calendar-day--selected', 'The 15th is selected');
    await calendarSelect('.calendar-select-1', new Date(2013, 9, 11));

    assert.dom('.calendar-select-1 [data-date="2013-10-11"]').hasClass('ember-power-calendar-day--selected', 'The 11th of October is selected');
  });

  test('`calendarSelect` selects the given date changing the month center on the process', async function(assert) {
    await visit('/helpers-testing');

    assert.dom('.calendar-select-1 .ember-power-calendar-nav-title').hasText('October 2013');
    assert.dom('.calendar-select-1 [data-date="2013-10-15"]').hasClass('ember-power-calendar-day--selected', 'The 15th is selected');
    await calendarSelect('.calendar-select-1', new Date(2013, 8, 3));

    assert.dom('.calendar-select-1 .ember-power-calendar-nav-title').hasText('September 2013', 'The nav component has updated');
    assert.dom('.calendar-select-1 [data-date="2013-09-01"]').exists('The days component has updated');
    assert.dom('.calendar-select-1 [data-date="2013-09-03"]').hasClass('ember-power-calendar-day--selected', 'The 3rd of september is selected');
  });

  test('`calendarSelect` selects the given date in wormhole', async function(assert) {
    await visit('/helpers-testing');

    await click('.calendar-in-dropdown input');
    assert.dom('.dropdown-content .ember-power-calendar-nav-title').hasText('October 2013');
    assert.dom('.dropdown-content [data-date="2013-10-15"]').hasClass('ember-power-calendar-day--selected', 'The 15th is selected');
    await calendarSelect('.dropdown-content', new Date(2013, 8, 3));

    assert.dom('.dropdown-content .ember-power-calendar-nav-title').hasText('September 2013', 'The nav component has updated');
    assert.dom('.dropdown-content [data-date="2013-09-01"]').exists('The days component has updated');
    assert.dom('.dropdown-content [data-date="2013-09-03"]').hasClass('ember-power-calendar-day--selected', 'The 3rd of september is selected');
  });
});
