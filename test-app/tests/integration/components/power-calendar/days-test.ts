import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, type TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { run } from '@ember/runloop';
import { TrackedObject } from 'tracked-built-ins';
import ownProp from 'test-app/utils/own-prop';

import { dependencySatisfies, macroCondition } from '@embroider/macros';
import type PowerCalendarService from 'ember-power-calendar/services/power-calendar';
import type { PowerCalendarAPI } from 'ember-power-calendar/components/power-calendar';
import type { TWeekdayFormat } from 'ember-power-calendar/utils';
import type { TDayClass } from 'ember-power-calendar/helpers/ember-power-calendar-day-classes';

let dateLibrary = '';

if (macroCondition(dependencySatisfies('moment', '*'))) {
  dateLibrary = 'moment';
} else if (macroCondition(dependencySatisfies('luxon', '*'))) {
  dateLibrary = 'luxon';
}

let calendarService: PowerCalendarService;
let calendar: PowerCalendarAPI;

interface Context extends TestContext {
  element: HTMLElement;
  center: Date | undefined;
  calendar: PowerCalendarAPI;
  startOfWeek: string | undefined;
  weekdayFormat: TWeekdayFormat;
  classFn: TDayClass<PowerCalendarAPI>;
}

module('Integration | Component | <PowerCalendar::Days>', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    calendarService = this.owner.lookup(
      'service:power-calendar',
    ) as PowerCalendarService;
    calendarService.set('date', new Date(2013, 9, 18));
    calendarService.set('locale', 'en-US');
    calendar = new TrackedObject({
      uniqueId: 'test-calendar',
      loading: false,
      type: 'single',
      center: calendarService.getDate(),
      locale: calendarService.get('locale'),
      actions: {
        moveCenter: async () => {},
        select: () => {},
      },
    }) as PowerCalendarAPI;
  });

  test<Context>('[i18n] The name of the weekdays respect the locale set in the calendar service', async function (assert) {
    assert.expect(2);
    this.center = new Date(2016, 10, 15);
    calendarService.set('locale', 'fr');
    await render<Context>(
      hbs`<PowerCalendar @center={{this.center}} as |cal|><cal.Days/></PowerCalendar>`,
    );
    assert.strictEqual(
      (
        this.element.querySelector(
          '.ember-power-calendar-weekdays',
        ) as HTMLElement
      ).textContent
        .replace(/\s+/g, ' ')
        .trim(),
      'lun. mar. mer. jeu. ven. sam. dim.',
    );
    assert.strictEqual(
      (
        this.element.querySelectorAll(
          '.ember-power-calendar-day',
        )[0] as HTMLElement
      ).dataset['date'],
      '2016-10-31',
    );
  });

  test<Context>('[i18n] The user can force a different locale from the one set the calendar service passing `locale="some-locale"`', async function (assert) {
    assert.expect(2);
    this.calendar = calendar;
    await render<Context>(
      hbs`<PowerCalendar::Days @calendar={{this.calendar}}/>`,
    );
    assert.strictEqual(
      (
        this.element.querySelector(
          '.ember-power-calendar-weekdays',
        ) as HTMLElement
      ).textContent
        .replace(/\s+/g, ' ')
        .trim(),
      'Sun Mon Tue Wed Thu Fri Sat',
    );
    run(() => (this.calendar.locale = 'es'));

    assert.strictEqual(
      (
        this.element.querySelector(
          '.ember-power-calendar-weekdays',
        ) as HTMLElement
      ).textContent
        .replace(/\s+/g, ' ')
        .trim(),
      'lun. mar. mié. jue. vie. sáb. dom.',
    );
  });

  test<Context>('[i18n] The it receives a `startOfWeek` option, that weekday becomes the start of the week over any default the locale might have', async function (assert) {
    assert.expect(12);
    let days;
    this.calendar = calendar;
    this.startOfWeek = '2';
    await render<Context>(
      hbs`<PowerCalendar::Days @calendar={{this.calendar}} @startOfWeek={{this.startOfWeek}}/>`,
    );

    assert
      .dom(this.element.querySelectorAll('.ember-power-calendar-weekday')[0])
      .hasText('Tue', 'The week starts on Tuesday');
    days = this.element.querySelectorAll('.ember-power-calendar-day');
    assert
      .dom(days[0])
      .hasText('1', 'The first day of the first week is the 1st of October');
    assert
      .dom(days[days.length - 1])
      .hasText('4', 'The last day of the last week the 4th of November');

    run(() => this.set('startOfWeek', '3'));
    assert
      .dom(this.element.querySelectorAll('.ember-power-calendar-weekday')[0])
      .hasText('Wed', 'The week starts on Wednesday');
    days = this.element.querySelectorAll('.ember-power-calendar-day');
    assert
      .dom(days[0])
      .hasText(
        '25',
        'The first day of the first week is the 25th of September',
      );
    assert
      .dom(days[days.length - 1])
      .hasText('5', 'The last day of the last week is the 5th of November');

    run(() => this.set('startOfWeek', '5'));
    assert
      .dom(this.element.querySelectorAll('.ember-power-calendar-weekday')[0])
      .hasText('Fri', 'The week starts on Friday');
    days = this.element.querySelectorAll('.ember-power-calendar-day');
    assert
      .dom(days[0])
      .hasText(
        '27',
        'The first day of the first week is the 25th of September',
      );
    assert
      .dom(days[days.length - 1])
      .hasText('31', 'The last day of the last week is the 31th of October');

    run(() => this.set('calendar.locale', 'pt'));
    if (dateLibrary === 'luxon') {
      assert
        .dom('.ember-power-calendar-weekday')
        .hasText('sex.', 'The week starts on Sexta Feira');
    } else {
      assert
        .dom(this.element.querySelectorAll('.ember-power-calendar-weekday')[0])
        .hasText('Sex', 'The week starts on Sexta Feira');
    }
    days = this.element.querySelectorAll('.ember-power-calendar-day');
    assert
      .dom(days[0])
      .hasText(
        '27',
        'The first day of the first week is the 25th of September',
      );
    assert
      .dom(days[days.length - 1])
      .hasText('31', 'The last day of the last week is the 31th of October');
  });

  test<Context>('The format of the weekdays can be changed passing `weekdayFormat="long|short|min"`', async function (assert) {
    this.calendar = calendar;
    await render<Context>(
      hbs`<PowerCalendar::Days @calendar={{this.calendar}} @weekdayFormat={{this.weekdayFormat}}/>`,
    );
    assert.strictEqual(
      (
        this.element.querySelector(
          '.ember-power-calendar-weekdays',
        ) as HTMLElement
      ).textContent
        .replace(/\s+/g, ' ')
        .trim(),
      'Sun Mon Tue Wed Thu Fri Sat',
    );
    run(() => this.set('weekdayFormat', 'long'));
    assert.strictEqual(
      (
        this.element.querySelector(
          '.ember-power-calendar-weekdays',
        ) as HTMLElement
      ).textContent
        .replace(/\s+/g, ' ')
        .trim(),
      'Sunday Monday Tuesday Wednesday Thursday Friday Saturday',
    );
    run(() => this.set('weekdayFormat', 'min'));

    let expectedResult = 'Su Mo Tu We Th Fr Sa';
    if (dateLibrary === 'luxon') {
      expectedResult = 'S M T W T F S';
    }

    assert.strictEqual(
      (
        this.element.querySelector(
          '.ember-power-calendar-weekdays',
        ) as HTMLElement
      ).textContent
        .replace(/\s+/g, ' ')
        .trim(),
      expectedResult,
    );
  });

  test<Context>("If it receives `showDaysAround=false` option, it doesn't show the days before or after the first day of the month", async function (assert) {
    assert.expect(3);
    this.calendar = calendar;
    calendar.locale = 'es';
    await render<Context>(
      hbs`<PowerCalendar::Days @calendar={{this.calendar}} @showDaysAround={{false}}/>`,
    );
    const weeks = this.element.querySelectorAll<HTMLElement>(
      '.ember-power-calendar-week',
    );
    assert
      .dom('.ember-power-calendar-day', weeks[0])
      .exists({ count: 6 }, 'The first week has 6 days');
    assert.strictEqual(
      weeks[0]?.dataset['missingDays'],
      '1',
      'It has a special data-attribute',
    );
    assert
      .dom('.ember-power-calendar-day', weeks[4])
      .exists({ count: 4 }, 'The last week has 4 days');
  });

  test<Context>('it can receive a `dayClass` property containing a string to add classes to days', async function (assert) {
    assert.expect(1);
    this.calendar = calendar;
    await render<Context>(
      hbs`<PowerCalendar::Days @calendar={{this.calendar}} @dayClass="custom-day-class"/>`,
    );
    assert.dom('.ember-power-calendar-day').hasClass('custom-day-class');
  });

  test<Context>('it can receive a `dayClass` property containing a function to add classes to days', async function (assert) {
    assert.expect(106);
    this.classFn = (day, calendar, weeks) => {
      assert.ok(ownProp(day, 'isCurrentMonth'), 'the first argument is a day');
      assert.ok(
        ownProp(calendar, 'actions'),
        'the second argument is the calendar',
      );
      assert.ok(Array.isArray(weeks), 'the third argument is arr');
      return 'some-computed-class';
    };
    this.calendar = calendar;
    await render<Context>(
      hbs`<PowerCalendar::Days @calendar={{this.calendar}} @dayClass={{this.classFn}}/>`,
    );
    assert.dom('.ember-power-calendar-day').hasClass('some-computed-class');
  });

  test<Context>('It can receive `center`', async function (assert) {
    assert.expect(1);
    this.calendar = calendar;
    this.center = new Date(2017, 11, 1);
    await render<Context>(
      hbs`<PowerCalendar::Days @calendar={{this.calendar}} @center={{this.center}}/>`,
    );
    assert.dom('[data-date="2017-12-15"]').exists();
  });

  test<Context>("If it doesn't receive `center`, it uses calendar's center", async function (assert) {
    assert.expect(1);
    this.calendar = calendar;
    await render<Context>(
      hbs`<PowerCalendar::Days @calendar={{this.calendar}}/>`,
    );
    assert.dom('[data-date="2013-10-15"]').exists();
  });

  test<Context>('The `data-power-calendar-id` attribute takes the value of the `calendarUniqueId` if present, or the `uniqueId` otherwise', async function (assert) {
    assert.expect(2);
    this.calendar = Object.assign({}, calendar, { calendarUniqueId: '123abc' });
    await render<Context>(
      hbs`<PowerCalendar::Days @calendar={{this.calendar}}/>`,
    );
    assert
      .dom('.ember-power-calendar-days')
      .hasAttribute('data-power-calendar-id', '123abc');
    this.set('calendar', Object.assign({}, calendar, { uniqueId: '987zwx' }));
    await render<Context>(
      hbs`<PowerCalendar::Days @calendar={{this.calendar}}/>`,
    );
    assert
      .dom('.ember-power-calendar-days')
      .hasAttribute('data-power-calendar-id', '987zwx');
  });
});
