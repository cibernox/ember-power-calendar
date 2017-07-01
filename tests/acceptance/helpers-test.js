import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import { visit, find } from 'ember-native-dom-helpers';
import {
  calendarSelect,
  calendarCenter
} from 'ember-power-calendar/test-support';

moduleForAcceptance('Acceptance | helpers | calendarCenter');

test('`calendarCenter` invokes the `onCenterChange` action of the target component inside the selector we pass it', async function(
  assert
) {
  await visit('/helpers-testing');
  assert.equal(
    find(
      '.calendar-center-1 .ember-power-calendar-nav-title'
    ).textContent.trim(),
    'October 2013'
  );

  await calendarCenter('.calendar-center-1', new Date(2013, 8, 3));
  assert.equal(
    find(
      '.calendar-center-1 .ember-power-calendar-nav-title'
    ).textContent.trim(),
    'September 2013',
    'The nav component has updated'
  );
  assert.ok(
    find('.calendar-center-1 [data-date="2013-09-01"]'),
    'The days component has updated'
  );
});

test('`calendarCenter` invokes the `onCenterChange` action of the target component WITH the selector we pass it', async function(
  assert
) {
  await visit('/helpers-testing');

  assert.equal(
    find(
      '.calendar-center-2-calendar .ember-power-calendar-nav-title'
    ).textContent.trim(),
    'October 2013'
  );
  await calendarCenter('.calendar-center-2-calendar', new Date(2013, 8, 3));

  assert.equal(
    find(
      '.calendar-center-2-calendar .ember-power-calendar-nav-title'
    ).textContent.trim(),
    'September 2013',
    'The nav component has updated'
  );
  assert.ok(
    find('.calendar-center-2-calendar [data-date="2013-09-01"]'),
    'The days component has updated'
  );
});

test('`calendarCenter` throws an error if called on a calendar without `onCenterChange` action', async function(
  assert
) {
  assert.expect(2);
  await visit('/helpers-testing');

  assert.equal(
    find(
      '.calendar-center-3 .ember-power-calendar-nav-title'
    ).textContent.trim(),
    'October 2013'
  );
  return calendarCenter(
    '.calendar-center-3',
    new Date(2013, 8, 3)
  ).catch((error) => {
    assert.equal(
      error.message,
      "Assertion Failed: You cannot call `calendarCenter` on a component that doesn't has an `onCenterChange` action"
    );
  });
});

test('`calendarCenter` throws an error it cannot find a calendar using the given selector', async function(
  assert
) {
  assert.expect(1);
  await visit('/helpers-testing');

  return calendarCenter(
    '.non-exister-selector',
    new Date(2013, 8, 3)
  ).catch((error) => {
    assert.equal(
      error.message,
      'Assertion Failed: Could not find a calendar using selector: ".non-exister-selector"'
    );
  });
});

test('`calendarCenter` works even if the calendar is tagless', async function(
  assert
) {
  assert.expect(2);
  await visit('/helpers-testing');
  await calendarCenter('.calendar-center-4', new Date(2013, 8, 3));

  assert.equal(
    find(
      '.calendar-center-4 .ember-power-calendar-nav-title'
    ).textContent.trim(),
    'September 2013',
    'The nav component has updated'
  );
  assert.ok(
    find('.calendar-center-4 [data-date="2013-09-01"]'),
    'The days component has updated'
  );
});

moduleForAcceptance('Acceptance | helpers | calendarSelect');

test('`calendarSelect` selects the given date ', async function(assert) {
  await visit('/helpers-testing');

  assert.equal(
    find(
      '.calendar-select-1 .ember-power-calendar-nav-title'
    ).textContent.trim(),
    'October 2013'
  );
  assert.ok(
    find('.calendar-select-1 [data-date="2013-10-15"]').classList.contains(
      'ember-power-calendar-day--selected'
    ),
    'The 15th is selected'
  );
  await calendarSelect('.calendar-select-1', new Date(2013, 9, 11));

  assert.ok(
    find('.calendar-select-1 [data-date="2013-10-11"]').classList.contains(
      'ember-power-calendar-day--selected'
    ),
    'The 11th of October is selected'
  );
});

test('`calendarSelect` selects the given date changing the month center on the process', async function(
  assert
) {
  await visit('/helpers-testing');

  assert.equal(
    find(
      '.calendar-select-1 .ember-power-calendar-nav-title'
    ).textContent.trim(),
    'October 2013'
  );
  assert.ok(
    find('.calendar-select-1 [data-date="2013-10-15"]').classList.contains(
      'ember-power-calendar-day--selected'
    ),
    'The 15th is selected'
  );
  await calendarSelect('.calendar-select-1', new Date(2013, 8, 3));

  assert.equal(
    find(
      '.calendar-select-1 .ember-power-calendar-nav-title'
    ).textContent.trim(),
    'September 2013',
    'The nav component has updated'
  );
  assert.ok(
    find('.calendar-select-1 [data-date="2013-09-01"]'),
    'The days component has updated'
  );
  assert.ok(
    find('.calendar-select-1 [data-date="2013-09-03"]').classList.contains(
      'ember-power-calendar-day--selected'
    ),
    'The 3rd of september is selected'
  );
});
