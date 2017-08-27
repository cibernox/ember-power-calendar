import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { find } from 'ember-native-dom-helpers';
import { calendarSelect, calendarCenter, initCalendarHelpers } from 'ember-power-calendar/test-support';

moduleForComponent('integration-helpers-testing', 'Integration | Component | helpers test', {
  integration: true,
  beforeEach() {
    initCalendarHelpers(this.container);
  }
});

test('`calendarCenter` works in integration test', async function(assert) {
  this.set('defaultCenter', new Date(2013, 9, 18));
  this.render(hbs`{{integration-helpers-testing center1=defaultCenter}}`);
  assert.equal(find('.calendar-center-1 .ember-power-calendar-nav-title').textContent.trim(), 'October 2013');

  await calendarCenter('.calendar-center-1', new Date(2013, 8, 3));
  assert.equal(
    find('.calendar-center-1 .ember-power-calendar-nav-title').textContent.trim(),
    'September 2013',
    'The nav component has updated'
  );
  assert.ok(find('.calendar-center-1 [data-date="2013-09-01"]'), 'The days component has updated');
});

test('`calendarSelect` selects the given date ', async function(assert) {
  this.set('defaultCenter', new Date(2013, 9, 18));
  this.set('selected', new Date(2013, 9, 15));
  this.render(hbs`{{integration-helpers-testing center4=defaultCenter selected4=selected}}`);

  assert.equal(find('.calendar-select-1 .ember-power-calendar-nav-title').textContent.trim(), 'October 2013');
  assert.ok(
    find('.calendar-select-1 [data-date="2013-10-15"]').classList.contains('ember-power-calendar-day--selected'),
    'The 15th is selected'
  );
  await calendarSelect('.calendar-select-1', new Date(2013, 9, 11));

  assert.ok(
    find('.calendar-select-1 [data-date="2013-10-11"]').classList.contains('ember-power-calendar-day--selected'),
    'The 11th of October is selected'
  );
});
