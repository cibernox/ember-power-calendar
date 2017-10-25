import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../../assertions';
import moment from 'moment';
import { run } from '@ember/runloop';
import { find, findAll } from 'ember-native-dom-helpers';

let calendarService, momentService, calendar;

module('Integration | Component | power-calendar/days', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    assertionInjector(this);
    calendarService = this.owner.lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    momentService = this.owner.lookup('service:moment');
    calendar = {
      center: moment(calendarService.getDate()),
      locale: 'en',
      actions: {
        moveCenter: () => {},
        select: () => {}
      }
    };
  });

  hooks.afterEach(function() {
    run(() => momentService.changeLocale('en-US'));
    assertionCleanup(this);
  });

  test('[i18n] The name of the weekdays respect the locale set in the moment service', async function(assert) {
    assert.expect(1);
    run(() => momentService.changeLocale('pt'));
    await render(hbs`{{#power-calendar as |cal|}}{{cal.days}}{{/power-calendar}}`);
    assert.equal(find('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'Seg Ter Qua Qui Sex Sáb Dom');
  });

  test('[i18n] The name of the weekdays respect the locale set in the `moment` global', async function(assert) {
    assert.expect(2);
    this.center = new Date(2016, 10, 15);
    let originalLocale = moment.locale();
    moment.locale('fr');
    await render(
      hbs`{{#power-calendar center=center as |cal|}}{{cal.days}}{{/power-calendar}}`
    );
    assert.equal(find('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'lun. mar. mer. jeu. ven. sam. dim.');
    assert.equal(findAll('.ember-power-calendar-day')[0].dataset.date, '2016-10-31');
    moment.locale(originalLocale);
  });

  test('[i18n] The user can force a different locale from the one set in moment.js passing `locale="some-locale"`', async function(assert) {
    assert.expect(2);
    this.calendar = calendar;
    await render(hbs`{{power-calendar/days calendar=calendar}}`);
    assert.equal(find('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'Sun Mon Tue Wed Thu Fri Sat');
    run(() => this.set('calendar.locale', 'es'));
    assert.equal(find('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'lun. mar. mié. jue. vie. sáb. dom.');
  });

  test('[i18n] The it receives a `startOfWeek` option, that weekday becomes the start of the week over any default the locale might have', async function(assert) {
    assert.expect(12);
    let days;
    this.calendar = calendar;
    this.startOfWeek = '2';
    await render(hbs`{{power-calendar/days calendar=calendar startOfWeek=startOfWeek}}`);

    assert.equal(findAll('.ember-power-calendar-weekday')[0].textContent.trim(), 'Tue', 'The week starts on Tuesday');
    days = findAll('.ember-power-calendar-day');
    assert.equal(days[0].textContent.trim(), '1', 'The first day of the first week is the 1st of October');
    assert.equal(days[days.length - 1].textContent.trim(), '4', 'The last day of the last week the 4th of November');

    run(() => this.set('startOfWeek', '3'));
    assert.equal(findAll('.ember-power-calendar-weekday')[0].textContent.trim(), 'Wed', 'The week starts on Wednesday');
    days = findAll('.ember-power-calendar-day');
    assert.equal(days[0].textContent.trim(), '25', 'The first day of the first week is the 25th of September');
    assert.equal(days[days.length - 1].textContent.trim(), '5', 'The last day of the last week is the 5th of November');

    run(() => this.set('startOfWeek', '5'));
    assert.equal(findAll('.ember-power-calendar-weekday')[0].textContent.trim(), 'Fri', 'The week starts on Friday');
    days = findAll('.ember-power-calendar-day');
    assert.equal(days[0].textContent.trim(), '27', 'The first day of the first week is the 25th of September');
    assert.equal(days[days.length - 1].textContent.trim(), '31', 'The last day of the last week is the 31th of October');

    run(() => this.set('calendar.locale', 'pt'));
    assert.equal(findAll('.ember-power-calendar-weekday')[0].textContent.trim(), 'Sex', 'The week starts on Sexta Feira');
    days = findAll('.ember-power-calendar-day');
    assert.equal(days[0].textContent.trim(), '27', 'The first day of the first week is the 25th of September');
    assert.equal(days[days.length - 1].textContent.trim(), '31', 'The last day of the last week is the 31th of October');
  });

  test('The format of the weekdays can be changed passing `weekdayFormat="long|short|min"`', async function(assert) {
    this.calendar = calendar;
    await render(hbs`{{power-calendar/days calendar=calendar weekdayFormat=weekdayFormat}}`);
    assert.equal(find('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'Sun Mon Tue Wed Thu Fri Sat');
    run(() => this.set('weekdayFormat', 'long'));
    assert.equal(find('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday');
    run(() => this.set('weekdayFormat', 'min'));
    assert.equal(find('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'Su Mo Tu We Th Fr Sa');
  });

  test('If it receives `showDaysAround=false` option, it doesn\'t show the days before or after the first day of the month', async function(assert) {
    assert.expect(3);
    this.calendar = calendar;
    calendar.locale = 'es';
    await render(hbs`{{power-calendar/days calendar=calendar showDaysAround=false}}`);
    let weeks = findAll('.ember-power-calendar-week');
    assert.equal(findAll('.ember-power-calendar-day', weeks[0]).length, 6, 'The first week has 6 days');
    assert.equal(weeks[0].dataset.missingDays, 1, 'It has a special data-attribute');
    assert.equal(findAll('.ember-power-calendar-day', weeks[4]).length, 4, 'The last week has 4 days');
  });

  test('It can receive `data-power-calendar-id` and it is bound to an attribute', async function(assert) {
    assert.expect(1);
    this.calendar = calendar;
    await render(
      hbs`{{power-calendar/days calendar=calendar data-power-calendar-id="foobar"}}`
    );
    assert.equal(find('.ember-power-calendar-days').dataset.powerCalendarId, 'foobar', 'The attribute is bound');
  });
});
