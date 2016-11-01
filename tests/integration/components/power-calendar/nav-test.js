import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../../assertions';
import moment from 'moment';
import run from 'ember-runloop';
import getOwner from 'ember-owner/get';

let calendarService, calendar;
moduleForComponent('power-calendar', 'Integration | Component | power-calendar/nav', {
  integration: true,
  beforeEach() {
    assertionInjector(this);
    calendarService = getOwner(this).lookup('service:power-calendar-clock');
    calendarService.set('date', new Date(2013, 9, 18));
    calendar = {
      center: moment(calendarService.getDate()),
      actions: {
        changeCenter: () => {},
        select: () => {}
      }
    };
  },

  afterEach() {
    moment.locale('en-US');
    assertionCleanup(this);
  }
});

test('[i18n] The name of the month respect the locale set in moment.js', function(assert) {
  assert.expect(1);
  moment.locale('pt');
  this.render(hbs`{{#power-calendar as |cal|}}{{cal.nav}}{{/power-calendar}}`);
  assert.equal(this.$('.ember-power-calendar-nav-title').text().trim(), 'Outubro 2013');
});

test('[i18n] If the user sets a different locale in the calendar, this setting overrides the locale set in moment.js', function(assert) {
  assert.expect(2);
  this.calendar = calendar;
  this.render(hbs`{{power-calendar/nav calendar=calendar}}`);
  assert.equal(this.$('.ember-power-calendar-nav-title').text().trim(), 'October 2013');
  run(() => this.set('calendar.locale', 'es'));
  assert.equal(this.$('.ember-power-calendar-nav-title').text().trim(), 'octubre 2013');
});
