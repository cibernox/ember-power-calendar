import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | helpers | calendarCenter');

test('`calendarCenter` invokes the `onCenterChange` action of the target component inside the selector we pass it', function(assert) {
  visit('/helpers-testing');

  andThen(function() {

    assert.equal(find('.calendar-center-1 .ember-power-calendar-nav-title').text().trim(), 'October 2013');
    calendarCenter('.calendar-center-1', new Date(2013, 8, 3));
  });

  andThen(function() {
    assert.equal(find('.calendar-center-1 .ember-power-calendar-nav-title').text().trim(), 'September 2013', 'The nav component has updated');
    assert.equal(find('.calendar-center-1 [data-date=2013-09-01]').length, 1, 'The days component has updated');
  });
});

test('`calendarCenter` invokes the `onCenterChange` action of the target component WITH the selector we pass it', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(find('.calendar-center-2-calendar .ember-power-calendar-nav-title').text().trim(), 'October 2013');
    calendarCenter('.calendar-center-2-calendar', new Date(2013, 8, 3));
  });

  andThen(function() {
    assert.equal(find('.calendar-center-2-calendar .ember-power-calendar-nav-title').text().trim(), 'September 2013', 'The nav component has updated');
    assert.equal(find('.calendar-center-2-calendar [data-date=2013-09-01]').length, 1, 'The days component has updated');
  });
});

test('`calendarCenter` throws an error if callend on a calendar without `onCenterChange` action', function(assert) {
  assert.expect(2);
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(find('.calendar-center-3 .ember-power-calendar-nav-title').text().trim(), 'October 2013');
    calendarCenter('.calendar-center-3', new Date(2013, 8, 3)).catch((error) => {
      assert.equal(error.message, 'Assertion Failed: You cannot call `calendarCenter` on a component that doesn\'t has an `onCenterChange` action');
    });
  });
});

moduleForAcceptance('Acceptance | helpers | calendarSelect');

test('`calendarSelect` selects the given date ', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(find('.calendar-select-1 .ember-power-calendar-nav-title').text().trim(), 'October 2013');
    assert.ok(find('.calendar-select-1 [data-date=2013-10-15]').hasClass('ember-power-calendar-day--selected'), 'The 15th is selected');
    calendarSelect('.calendar-select-1', new Date(2013, 9, 11));
  });

  andThen(function() {
    assert.ok(find('.calendar-select-1 [data-date=2013-10-11]').hasClass('ember-power-calendar-day--selected'), 'The 11th of October is selected');
  });
});

test('`calendarSelect` selects the given date changing the month center on the process', function(assert) {
  visit('/helpers-testing');

  andThen(function() {
    assert.equal(find('.calendar-select-1 .ember-power-calendar-nav-title').text().trim(), 'October 2013');
    assert.ok(find('.calendar-select-1 [data-date=2013-10-15]').hasClass('ember-power-calendar-day--selected'), 'The 15th is selected');
    calendarSelect('.calendar-select-1', new Date(2013, 8, 3));
  });

  andThen(function() {
    assert.equal(find('.calendar-select-1 .ember-power-calendar-nav-title').text().trim(), 'September 2013', 'The nav component has updated');
    assert.equal(find('[data-date=2013-09-01]').length, 1, 'The days component has updated');
    assert.ok(find('.calendar-select-1 [data-date=2013-09-03]').hasClass('ember-power-calendar-day--selected'), 'The 3rd of september is selected');
  });
});