import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../../assertions';
import moment from 'moment';
import run from 'ember-runloop';
import getOwner from 'ember-owner/get';

let calendarService, calendar;
moduleForComponent('power-calendar', 'Integration | Component | power-calendar/days', {
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

test('[i18n] The name of the weekdays respect the locale set in moment.js', function(assert) {
  assert.expect(1);
  this.calendar = calendar;
  moment.locale('pt');
  this.render(hbs`{{power-calendar/days calendar=calendar}}`);
  assert.equal(this.$('.ember-power-calendar-weekdays').text().replace(/\s+/g, ' ').trim(), 'Seg Ter Qua Qui Sex Sáb Dom');
});

test('[i18n] The user can force a different locale from the one set in moment.js passing `locale="some-locale"`', function(assert) {
  assert.expect(2);
  this.calendar = calendar;
  this.render(hbs`{{power-calendar/days calendar=calendar locale=locale}}`);
  assert.equal(this.$('.ember-power-calendar-weekdays').text().replace(/\s+/g, ' ').trim(), 'Sun Mon Tue Wed Thu Fri Sat');
  run(() => this.set('locale', 'es'));
  assert.equal(this.$('.ember-power-calendar-weekdays').text().replace(/\s+/g, ' ').trim(), 'lun. mar. mié. jue. vie. sáb. dom.');
});

test('[i18n] The it receives a `startOfWeek` option, that weekday becomes the start of the week over any default the locale might have', function(assert) {
  assert.expect(12);
  this.calendar = calendar;
  this.startOfWeek = '2';
  this.render(hbs`{{power-calendar/days calendar=calendar startOfWeek=startOfWeek locale=locale}}`);
  assert.equal(this.$('.ember-power-calendar-weekday:eq(0)').text().trim(), 'Tue', 'The week starts on Tuesday');
  assert.equal(this.$('.ember-power-calendar-day:eq(0)').text().trim(), '1', 'The first day of the first week is the 1st of October');
  assert.equal(this.$('.ember-power-calendar-day:last').text().trim(), '4', 'The last day of the last week the 4th of November');
  run(() => this.set('startOfWeek', '3'));
  assert.equal(this.$('.ember-power-calendar-weekday:eq(0)').text().trim(), 'Wed', 'The week starts on Wednesday');
  assert.equal(this.$('.ember-power-calendar-day:eq(0)').text().trim(), '25', 'The first day of the first week is the 25th of September');
  assert.equal(this.$('.ember-power-calendar-day:last').text().trim(), '5', 'The last day of the last week is the 5th of November');
  run(() => this.set('startOfWeek', '5'));
  assert.equal(this.$('.ember-power-calendar-weekday:eq(0)').text().trim(), 'Fri', 'The week starts on Friday');
  assert.equal(this.$('.ember-power-calendar-day:eq(0)').text().trim(), '27', 'The first day of the first week is the 25th of September');
  assert.equal(this.$('.ember-power-calendar-day:last').text().trim(), '31', 'The last day of the last week is the 31th of October');
  run(() => this.set('locale', 'pt'));
  assert.equal(this.$('.ember-power-calendar-weekday:eq(0)').text().trim(), 'Sex', 'The week starts on Sexta Feira');
  assert.equal(this.$('.ember-power-calendar-day:eq(0)').text().trim(), '27', 'The first day of the first week is the 25th of September');
  assert.equal(this.$('.ember-power-calendar-day:last').text().trim(), '31', 'The last day of the last week is the 31th of October');
});

test('If it receives `showDaysAround=false` option, it doesn\'t show the days before or after the first day of the month', function(assert) {
  assert.expect(3);
  this.calendar = calendar;
  this.render(hbs`{{power-calendar/days calendar=calendar locale="es" showDaysAround=false}}`);
  assert.equal(this.$('.ember-power-calendar-week:eq(0) .ember-power-calendar-day').length, 6, 'The first week has 6 days');
  assert.equal(this.$('.ember-power-calendar-week:eq(0)').data('missing-days'), 1, 'It has a special data-attribute');
  assert.equal(this.$('.ember-power-calendar-week:eq(4) .ember-power-calendar-day').length, 4, 'The last week has 4 days');
});