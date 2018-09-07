import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../../assertions';
import { run } from '@ember/runloop';

let calendarService;
let calendar;

module('Integration | Component | power-calendar/years', function(hooks) {
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

  test('The format of the years can be changed passing `yearFormat="<format string>"`', async function(assert) {
    this.calendar = calendar;
    
    await render(hbs`{{power-calendar/years calendar=calendar yearFormat=yearFormat}}`);
    assert.equal(
      this.element.querySelector('.ember-power-calendar-year-grid').textContent.replace(/\s+/g, ' ').trim(), 
      '2009 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020'
    );
    run(() => this.set('yearFormat', 'YY'));
    assert.equal(
      this.element.querySelector('.ember-power-calendar-year-grid').textContent.replace(/\s+/g, ' ').trim(), 
      '09 10 11 12 13 14 15 16 17 18 19 20'
    );
    run(() => this.set('yearFormat', 'YY MMM'));
    assert.equal(
      this.element.querySelector('.ember-power-calendar-year-grid').textContent.replace(/\s+/g, ' ').trim(), 
      '09 Jan 10 Jan 11 Jan 12 Jan 13 Jan 14 Jan 15 Jan 16 Jan 17 Jan 18 Jan 19 Jan 20 Jan'
    );
  });

  test('It can receive `data-power-calendar-id` and it is bound to an attribute', async function(assert) {
    assert.expect(1);
    this.calendar = calendar;
    await render(
      hbs`{{power-calendar/years calendar=calendar data-power-calendar-id="foobar"}}`
    );
    assert.dom('.ember-power-calendar-years').hasAttribute('data-power-calendar-id', 'foobar', 'The attribute is bound');
  });
});
