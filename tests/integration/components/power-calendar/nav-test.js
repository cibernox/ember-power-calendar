import { module, test, skip } from "qunit";
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../../assertions';
import { run } from '@ember/runloop';
import { find } from 'ember-native-dom-helpers';

let calendarService;
// let momentService;
let calendar;

module('Integration | Component | power-calendar/nav', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    assertionInjector(this);
    calendarService = this.owner.lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    // momentService = this.owner.lookup('service:moment');
    calendar = {
      center: calendarService.getDate(),
      actions: {
        moveCenter: () => {},
        select: () => {}
      }
    };
  });

  hooks.afterEach(function() {
    // run(() => momentService.changeLocale('en-US'));
    assertionCleanup(this);
  });

  skip('[i18n] The name of the month respect the locale set in moment.js', async function(assert) {
    assert.expect(1);
    run(() => momentService.changeLocale('pt'));
    await render(hbs`{{#power-calendar as |cal|}}{{cal.nav}}{{/power-calendar}}`);
    assert.equal(find('.ember-power-calendar-nav-title').textContent.trim(), 'outubro 2013');
  });

  test('[i18n] If the user sets a different locale in the calendar, this setting overrides the locale set in moment.js', async function(assert) {
    assert.expect(2);
    this.calendar = calendar;
    await render(hbs`{{power-calendar/nav calendar=calendar}}`);
    assert.equal(find('.ember-power-calendar-nav-title').textContent.trim(), 'October 2013');
    run(() => this.set('calendar.locale', 'es'));
    assert.equal(find('.ember-power-calendar-nav-title').textContent.trim(), 'octubre 2013');
  });
});
