import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../../assertions';
import { run } from '@ember/runloop';
import require from "require";

const dateLibrary = require.has("luxon") ? "luxon" : "moment";
let calendarService;
let calendar;

module('Integration | Component | power-calendar/days', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    assertionInjector(this);
    calendarService = this.owner.lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
    calendarService.set('locale', 'en-US');
    calendar = {
      center: calendarService.getDate(),
      locale: calendarService.get('locale'),
      actions: {
        moveCenter: () => {},
        select: () => {}
      }
    };
  });

  hooks.afterEach(function() {
    assertionCleanup(this);
  });

  test('[i18n] The name of the weekdays respect the locale set in the calendar service', async function(assert) {
    assert.expect(2);
    this.center = new Date(2016, 10, 15);
    calendarService.set('locale', 'fr');
    await render(
      hbs`{{#power-calendar center=center as |cal|}}{{cal.days}}{{/power-calendar}}`
    );
    assert.equal(this.element.querySelector('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'lun. mar. mer. jeu. ven. sam. dim.');
    assert.equal(this.element.querySelectorAll('.ember-power-calendar-day')[0].dataset.date, '2016-10-31');
  });

  test('[i18n] The user can force a different locale from the one set the calendar service passing `locale="some-locale"`', async function(assert) {
    assert.expect(2);
    this.calendar = calendar;
    await render(hbs`{{power-calendar/days calendar=calendar}}`);
    assert.equal(this.element.querySelector('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'Sun Mon Tue Wed Thu Fri Sat');
    run(() => this.set('calendar.locale', 'es'));
    assert.equal(this.element.querySelector('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'lun. mar. mié. jue. vie. sáb. dom.');
  });

  test('[i18n] The it receives a `startOfWeek` option, that weekday becomes the start of the week over any default the locale might have', async function(assert) {
    assert.expect(12);
    let days;
    this.calendar = calendar;
    this.startOfWeek = '2';
    await render(hbs`{{power-calendar/days calendar=calendar startOfWeek=startOfWeek}}`);

    assert.dom(this.element.querySelectorAll('.ember-power-calendar-weekday')[0]).hasText('Tue', 'The week starts on Tuesday');
    days = this.element.querySelectorAll('.ember-power-calendar-day');
    assert.dom(days[0]).hasText('1', 'The first day of the first week is the 1st of October');
    assert.dom(days[days.length - 1]).hasText('4', 'The last day of the last week the 4th of November');

    run(() => this.set('startOfWeek', '3'));
    assert.dom(this.element.querySelectorAll('.ember-power-calendar-weekday')[0]).hasText('Wed', 'The week starts on Wednesday');
    days = this.element.querySelectorAll('.ember-power-calendar-day');
    assert.dom(days[0]).hasText('25', 'The first day of the first week is the 25th of September');
    assert.dom(days[days.length - 1]).hasText('5', 'The last day of the last week is the 5th of November');

    run(() => this.set('startOfWeek', '5'));
    assert.dom(this.element.querySelectorAll('.ember-power-calendar-weekday')[0]).hasText('Fri', 'The week starts on Friday');
    days = this.element.querySelectorAll('.ember-power-calendar-day');
    assert.dom(days[0]).hasText('27', 'The first day of the first week is the 25th of September');
    assert.dom(days[days.length - 1]).hasText('31', 'The last day of the last week is the 31th of October');

    run(() => this.set('calendar.locale', 'pt'));
    if (dateLibrary === 'luxon') {
      assert.dom(this.element.querySelectorAll('.ember-power-calendar-weekday')[0]).hasText('sex', 'The week starts on Sexta Feira');
    } else {
      assert.dom(this.element.querySelectorAll('.ember-power-calendar-weekday')[0]).hasText('Sex', 'The week starts on Sexta Feira');
    }
    days = this.element.querySelectorAll('.ember-power-calendar-day');
    assert.dom(days[0]).hasText('27', 'The first day of the first week is the 25th of September');
    assert.dom(days[days.length - 1]).hasText('31', 'The last day of the last week is the 31th of October');
  });

  test('The format of the weekdays can be changed passing `weekdayFormat="long|short|min"`', async function(assert) {
    this.calendar = calendar;
    await render(hbs`{{power-calendar/days calendar=calendar weekdayFormat=weekdayFormat}}`);
    assert.equal(this.element.querySelector('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'Sun Mon Tue Wed Thu Fri Sat');
    run(() => this.set('weekdayFormat', 'long'));
    assert.equal(this.element.querySelector('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday');
    run(() => this.set('weekdayFormat', 'min'));
    if (dateLibrary === 'luxon') {
      assert.equal(this.element.querySelector('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'S M T W T F S');
    } else {
      assert.equal(this.element.querySelector('.ember-power-calendar-weekdays').textContent.replace(/\s+/g, ' ').trim(), 'Su Mo Tu We Th Fr Sa');
    }
  });

  test('If it receives `showDaysAround=false` option, it doesn\'t show the days before or after the first day of the month', async function(assert) {
    assert.expect(3);
    this.calendar = calendar;
    calendar.locale = 'es';
    await render(hbs`{{power-calendar/days calendar=calendar showDaysAround=false}}`);
    let weeks = this.element.querySelectorAll('.ember-power-calendar-week');
    assert.dom('.ember-power-calendar-day', weeks[0]).exists({ count: 6 }, 'The first week has 6 days');
    assert.equal(weeks[0].dataset.missingDays, 1, 'It has a special data-attribute');
    assert.dom('.ember-power-calendar-day', weeks[4]).exists({ count: 4 }, 'The last week has 4 days');
  });

  test('It can receive `data-power-calendar-id` and it is bound to an attribute', async function(assert) {
    assert.expect(1);
    this.calendar = calendar;
    await render(
      hbs`{{power-calendar/days calendar=calendar data-power-calendar-id="foobar"}}`
    );
    assert.dom('.ember-power-calendar-days').hasAttribute('data-power-calendar-id', 'foobar', 'The attribute is bound');
  });

  test('it can receive a `dayClass` property containing a string to add classes to days', async function(assert) {
    assert.expect(1);
    this.calendar = calendar;
    await render(hbs`{{power-calendar/days calendar=calendar dayClass="custom-day-class"}}`);
    assert.dom('.ember-power-calendar-day').hasClass('custom-day-class');
  });

  test('it can receive a `dayClass` property containing a function to add classes to days', async function (assert) {
    assert.expect(106);
    this.classFn = (day, calendar, weeks) => {
      assert.ok(day.hasOwnProperty('isCurrentMonth'), 'the first argument is a day');
      assert.ok(calendar.hasOwnProperty('actions'), 'the second argument is the calendar');
      assert.ok(Array.isArray(weeks), 'the third argument is arr');
      return 'some-computed-class';
    }
    this.calendar = calendar;
    await render(hbs`{{power-calendar/days calendar=calendar dayClass=classFn}}`);
    assert.dom('.ember-power-calendar-day').hasClass('some-computed-class');
  });

  test('It can receive `center`', async function(assert) {
    assert.expect(1);
    this.calendar = calendar;
    this.center = new Date(2017, 11, 1);
    await render(
      hbs`{{power-calendar/days calendar=calendar center=center}}`
    );
    assert.dom('[data-date="2017-12-15"]').exists();
  });

  test('If it doesn\'t receive `center`, it uses calendar\'s center', async function(assert) {
    assert.expect(1);
    this.calendar = calendar;
    await render(
      hbs`{{power-calendar/days calendar=calendar}}`
    );
    assert.dom('[data-date="2013-10-15"]').exists();
  });
});
