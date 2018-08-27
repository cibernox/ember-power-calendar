import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../../assertions';
import { run } from '@ember/runloop';

let calendarService;
let calendar;

module('Integration | Component | power-calendar/months', function(hooks) {
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
        select: () => {},
        selectQuarter: () => {}
      }
    };
  });

  hooks.afterEach(function() {
    assertionCleanup(this);
  });

  test('[i18n] The name of the months respect the locale set in the calendar service', async function(assert) {
    assert.expect(1);
    this.center = new Date(2016, 10, 15);
    calendarService.set('locale', 'fr');
    await render(
      hbs`{{#power-calendar center=center as |cal|}}{{cal.months}}{{/power-calendar}}`
    );

    assert.equal(
      this.element.querySelector('.ember-power-calendar-month-grid').textContent.replace(/\s+/g, ' ').trim(), 
      'janv. févr. mars avr. mai juin juil. août sept. oct. nov. déc.'
    );
  });

  test('[i18n] The user can force a different locale from the one set the calendar service passing `locale="some-locale"`', async function(assert) {
    assert.expect(2);
    this.calendar = calendar;
    await render(hbs`{{power-calendar/months calendar=calendar}}`);
    assert.equal(
      this.element.querySelector('.ember-power-calendar-month-grid').textContent.replace(/\s+/g, ' ').trim(), 
      'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'
    );
    run(() => this.set('calendar.locale', 'es'));
    assert.equal(
      this.element.querySelector('.ember-power-calendar-month-grid').textContent.replace(/\s+/g, ' ').trim(), 
      'ene. feb. mar. abr. may. jun. jul. ago. sep. oct. nov. dic.'
    );
  });

  test('The format of the months can be changed passing `monthFormat="<format string>"`', async function(assert) {
    this.calendar = calendar;
    
    await render(hbs`{{power-calendar/months calendar=calendar monthFormat=monthFormat}}`);
    assert.equal(
      this.element.querySelector('.ember-power-calendar-month-grid').textContent.replace(/\s+/g, ' ').trim(), 
      'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'
    );
    run(() => this.set('monthFormat', 'MM'));
    assert.equal(
      this.element.querySelector('.ember-power-calendar-month-grid').textContent.replace(/\s+/g, ' ').trim(), 
      '01 02 03 04 05 06 07 08 09 10 11 12'
    );
    run(() => this.set('monthFormat', 'MMMM'));
    assert.equal(
      this.element.querySelector('.ember-power-calendar-month-grid').textContent.replace(/\s+/g, ' ').trim(), 
      'January February March April May June July August September October November December'
    );
  });

  test('It can receive `data-power-calendar-id` and it is bound to an attribute', async function(assert) {
    assert.expect(1);
    this.calendar = calendar;
    await render(
      hbs`{{power-calendar/months calendar=calendar data-power-calendar-id="foobar"}}`
    );
    assert.dom('.ember-power-calendar-months').hasAttribute('data-power-calendar-id', 'foobar', 'The attribute is bound');
  });
});
