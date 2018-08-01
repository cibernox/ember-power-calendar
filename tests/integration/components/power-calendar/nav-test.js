import { module, test } from "qunit";
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../../assertions';
import { run } from '@ember/runloop';
import { find } from 'ember-native-dom-helpers';

let calendarService;
let calendar;

module('Integration | Component | power-calendar/nav', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    assertionInjector(this);
    calendarService = this.owner.lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    calendar = {
      center: calendarService.getDate(),
      locale: 'en',
      actions: {
        moveCenter: () => {},
        select: () => {}
      }
    };
  });

  hooks.afterEach(function() {
    assertionCleanup(this);
  });

  test('[i18n] If the user sets a different locale in the calendar, this setting overrides the locale set in the calendar service', async function(assert) {
    assert.expect(2);
    this.calendar = calendar;
    await render(hbs`{{power-calendar/nav calendar=calendar}}`);
    assert.equal(find('.ember-power-calendar-nav-title').textContent.trim(), 'October 2013');
    run(() => this.set('calendar.locale', 'es'));
    assert.equal(find('.ember-power-calendar-nav-title').textContent.trim(), 'octubre 2013');
  });
});
