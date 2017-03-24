import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../../assertions';
import moment from 'moment';
import run from 'ember-runloop';
import getOwner from 'ember-owner/get';
import { find } from 'ember-native-dom-helpers';

let calendarService, momentService, calendar;
moduleForComponent('power-calendar', 'Integration | Component | power-calendar/nav', {
  integration: true,
  beforeEach() {
    assertionInjector(this);
    calendarService = getOwner(this).lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    momentService = getOwner(this).lookup('service:moment');
    calendar = {
      center: moment(calendarService.getDate()),
      actions: {
        moveCenter: () => {},
        select: () => {}
      }
    };
  },

  afterEach() {
    run(() => momentService.changeLocale('en-US'));
    assertionCleanup(this);
  }
});

test('[i18n] The name of the month respect the locale set in moment.js', function(assert) {
  assert.expect(1);
  run(() => momentService.changeLocale('pt'));
  this.render(hbs`{{#power-calendar as |cal|}}{{cal.nav}}{{/power-calendar}}`);
  assert.equal(find('.ember-power-calendar-nav-title').textContent.trim(), 'Outubro 2013');
});

test('[i18n] If the user sets a different locale in the calendar, this setting overrides the locale set in moment.js', function(assert) {
  assert.expect(2);
  this.calendar = calendar;
  this.render(hbs`{{power-calendar/nav calendar=calendar}}`);
  assert.equal(find('.ember-power-calendar-nav-title').textContent.trim(), 'October 2013');
  run(() => this.set('calendar.locale', 'es'));
  assert.equal(find('.ember-power-calendar-nav-title').textContent.trim(), 'octubre 2013');
});
