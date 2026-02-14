import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { run } from '@ember/runloop';
import {
  isSame,
  type NormalizeRangeActionValue,
  type SelectedPowerCalendarRange,
} from 'ember-power-calendar/test-support/helpers';
import type PowerCalendarService from 'ember-power-calendar/services/power-calendar';
import type {
  PowerCalendarRangeDay,
  TPowerCalendarRangeOnSelect,
} from 'ember-power-calendar/components/power-calendar-range';
import type { TestContext } from '@ember/test-helpers';

interface Context extends TestContext {
  element: HTMLElement;
  minRange?: number | undefined;
  rangeToSelect: PowerCalendarRangeDay;
  invalidDay: PowerCalendarRangeDay;
  validDay: PowerCalendarRangeDay;
  selected: SelectedPowerCalendarRange | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  onSelect?: TPowerCalendarRangeOnSelect | undefined;
}

module('Integration | Component | <PowerCalendarRange>', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const calendarService = this.owner.lookup(
      'service:power-calendar',
    ) as PowerCalendarService;
    calendarService.date = new Date(2013, 9, 18);
  });

  test<Context>('when it receives a range in the `selected` argument containing `Date` objects, the range is highlighted', async function (assert) {
    assert.expect(4);
    this.selected = { start: new Date(2016, 1, 5), end: new Date(2016, 1, 9) };
    await render<Context>(hbs`
      <PowerCalendarRange @selected={{this.selected}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendarRange>
    `);
    assert
      .dom('.ember-power-calendar-nav')
      .containsText(
        'February 2016',
        'The calendar is centered in the month of the selected date',
      );
    const allDaysInRangeAreSelected =
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2016-02-05"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2016-02-06"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2016-02-07"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2016-02-08"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2016-02-09"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected');
    assert.ok(allDaysInRangeAreSelected, 'All days in range are selected');
    assert
      .dom('.ember-power-calendar-day[data-date="2016-02-05"]')
      .hasClass(
        'ember-power-calendar-day--range-start',
        'The start of the range has a special class',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2016-02-09"]')
      .hasClass(
        'ember-power-calendar-day--range-end',
        'The end of the range has a special class',
      );
  });

  test<Context>('In range calendars, clicking a day selects one end of the range, and clicking another closes the range', async function (assert) {
    this.selected = undefined;
    let numberOfCalls = 0;
    this.onSelect = (range, calendar, e) => {
      numberOfCalls++;
      if (numberOfCalls === 1) {
        assert.ok(range.date.start, 'The start is present');
        assert.notOk(range.date.end, 'The end is not present');
      } else {
        assert.ok(range.date.start, 'The start is present');
        assert.ok(range.date.end, 'The end is also present');
      }
      this.set('selected', range.date);
      // @ts-expect-error Unsafe call of a(n) `error` type typed value.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      assert.isCalendar(
        calendar,
        "The second argument is the calendar's public API",
      );
      assert.ok(e instanceof Event, 'The third argument is an event');
    };
    await render<Context>(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendarRange>
    `);

    assert
      .dom('.ember-power-calendar-day--selected')
      .doesNotExist('No days have been selected');
    await click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .hasClass(
        'ember-power-calendar-day--selected',
        'The clicked date is selected',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .hasClass(
        'ember-power-calendar-day--range-start',
        'The clicked date is the start of the range',
      );
    await click('.ember-power-calendar-day[data-date="2013-10-15"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .hasClass(
        'ember-power-calendar-day--selected',
        'The first clicked date is still selected',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .hasClass(
        'ember-power-calendar-day--range-start',
        'The first clicked date is still the start of the range',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .hasClass(
        'ember-power-calendar-day--selected',
        'The clicked date is selected',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .hasClass(
        'ember-power-calendar-day--range-end',
        'The clicked date is the end of the range',
      );
    const allDaysInBetweenAreSelected =
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2013-10-11"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2013-10-12"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2013-10-13"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2013-10-14"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected');
    assert.ok(
      allDaysInBetweenAreSelected,
      'All days in between are also selected',
    );
    assert.strictEqual(
      numberOfCalls,
      2,
      'The onSelect action was called twice',
    );
  });

  test<Context>('When an range date object is passed, the range selection behavior is skipped', async function (assert) {
    this.rangeToSelect = {
      number: 1,
      id: 'test-id',
      isFocused: false,
      isCurrentMonth: true,
      isToday: false,
      isSelected: false,
      isDisabled: false,
      date: { start: null, end: null },
    };
    this.selected = { start: new Date(2013, 9, 5), end: new Date(2013, 9, 10) };
    this.onSelect = (range: NormalizeRangeActionValue) => {
      let value =
        range &&
        range.date &&
        'start' in range.date &&
        'end' in range.date;

      assert.ok(value, 'range selected has a start and end prop');

      value =
        range &&
        range.date &&
        range.date.start === null &&
        range.date.end === null;

      assert.ok(value, 'selected range has null start and end date');
    };

    await render<Context>(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        {{#if calendar.actions.select}}
          <button type="button" {{on "click" (fn calendar.actions.select this.rangeToSelect calendar)}} id="test_button"></button>
        {{/if}}
      </PowerCalendarRange>
    `);
    await click('#test_button');

    this.set('rangeToSelect', {
      date: { start: new Date(2013, 9, 15), end: new Date(2013, 9, 20) },
    });
    this.set('selected', {
      date: { start: new Date(2013, 9, 5), end: new Date(2013, 9, 10) },
    });
    this.set('onSelect', (range: NormalizeRangeActionValue) => {
      let value =
        range &&
        range.date &&
        'start' in range.date &&
        'end' in range.date;

      assert.ok(value, 'range selected has a start and end prop');

      if (
        !range.date.start ||
        !range.date.end ||
        !('start' in this.rangeToSelect.date) ||
        !this.rangeToSelect.date.start ||
        !('end' in this.rangeToSelect.date) ||
        !this.rangeToSelect.date.end
      ) {
        return;
      }

      value =
        range &&
        range.date &&
        isSame(range.date.start, this.rangeToSelect.date.start, 'day') &&
        isSame(range.date.end, this.rangeToSelect.date.end, 'day');

      assert.ok(
        value,
        'selected range matches range to select passed to select action.',
      );
    });
    await click('#test_button');
  });

  test<Context>('In range calendars, clicking first the end of the range and then the start is not a problem', async function (assert) {
    this.selected = undefined;
    let numberOfCalls = 0;
    this.onSelect = (range, calendar, e) => {
      numberOfCalls++;
      if (numberOfCalls === 1) {
        assert.ok(range.date.start, 'The start is present');
        assert.notOk(range.date.end, 'The end is not present');
      } else {
        assert.ok(range.date.start, 'The start is present');
        assert.ok(range.date.end, 'The end is also present');
      }
      this.set('selected', range.date);
      // @ts-expect-error Unsafe call of a(n) `error` type typed value.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      assert.isCalendar(
        calendar,
        "The second argument is the calendar's public API",
      );
      assert.ok(e instanceof Event, 'The third argument is an event');
    };
    await render<Context>(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendarRange>
    `);

    assert
      .dom('.ember-power-calendar-day--selected')
      .doesNotExist('No days have been selected');
    await click('.ember-power-calendar-day[data-date="2013-10-15"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .hasClass(
        'ember-power-calendar-day--selected',
        'The clicked date is selected',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .hasClass(
        'ember-power-calendar-day--range-start',
        'The clicked date is the start of the range',
      );
    await click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .hasClass(
        'ember-power-calendar-day--selected',
        'The first clicked date is still selected',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .hasClass(
        'ember-power-calendar-day--range-start',
        'The first clicked date is still the start of the range',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .hasClass(
        'ember-power-calendar-day--selected',
        'The clicked date is selected',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .hasClass(
        'ember-power-calendar-day--range-end',
        'The clicked date is the start of the range',
      );
    const allDaysInBetweenAreSelected =
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2013-10-11"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2013-10-12"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2013-10-13"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2013-10-14"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected');
    assert.ok(
      allDaysInBetweenAreSelected,
      'All days in between are also selected',
    );
    assert.strictEqual(
      numberOfCalls,
      2,
      'The onSelect action was called twice',
    );
  });

  test<Context>('Passing `minRange` allows to determine the minimum length of a range (in days)', async function (assert) {
    assert.expect(10);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<Context>(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} @minRange={{3}} as |cal|>
        <cal.Nav/>
        <cal.Days/>
      </PowerCalendarRange>
    `);

    await click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .isDisabled('The clicked day is disabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-11"]')
      .isDisabled('The next day is disabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-12"]')
      .isDisabled('The next-next day is disabled too');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-13"]')
      .isNotDisabled('The next-next-next day is enabled');

    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-09"]')
      .isDisabled('The prev day is disabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-08"]')
      .isDisabled('The prev-prev day is disabled too');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-07"]')
      .isNotDisabled('The prev-prev-prev day is enabled');

    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-12"]')
      .hasNoClass(
        'ember-power-calendar-day--selected',
        "Clicking a day not long enough didn't select anything",
      );
    await click('.ember-power-calendar-day[data-date="2013-10-13"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-13"]')
      .hasClass(
        'ember-power-calendar-day--selected',
        'Clicking outside the range select it',
      );
    const allDaysInBetweenAreSelected =
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2013-10-11"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2013-10-12"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected');
    assert.ok(
      allDaysInBetweenAreSelected,
      'the 11th and 12th day are selected',
    );
  });

  test<Context>('Passing `@minRange={{0}}` allows to make a range start and end on the same date', async function (assert) {
    assert.expect(7);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<Context>(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} @minRange={{0}} as |cal|>
        <cal.Nav/>
        <cal.Days/>
      </PowerCalendarRange>
    `);

    assert
      .dom('.ember-power-calendar-day--selected')
      .doesNotExist('No days have been selected');
    await click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .isNotDisabled('The clicked day is still enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .hasClass(
        'ember-power-calendar-day--selected',
        'The clicked date is selected',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .hasClass(
        'ember-power-calendar-day--range-start',
        'The clicked date is the start of the range',
      );

    await click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .hasClass(
        'ember-power-calendar-day--selected',
        'The clicked date is selected',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .hasClass(
        'ember-power-calendar-day--range-start',
        'The clicked date is the start of the range',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .hasClass(
        'ember-power-calendar-day--range-end',
        'The clicked date is also the end of the range',
      );
  });

  test<Context>('The default minRange is one day, but it can be changed passing convenient strings', async function (assert) {
    assert.expect(4);
    await render<Context>(hbs`
      <PowerCalendarRange @minRange={{this.minRange}} as |calendar|>
        <div class="formatted-min-range">{{calendar.minRange}}</div>
      </PowerCalendarRange>
    `);

    assert
      .dom('.formatted-min-range')
      .hasText('86400000', 'the default minRange is one day');
    run(() => this.set('minRange', 3));
    assert
      .dom('.formatted-min-range')
      .hasText(
        '259200000',
        'when passed a number, it is interpreted as number of days',
      );
    run(() => this.set('minRange', '1 week'));
    assert
      .dom('.formatted-min-range')
      .hasText('604800000', 'it can regognize humanized durations');
    run(() => this.set('minRange', '1m'));
    assert
      .dom('.formatted-min-range')
      .hasText(
        '60000',
        'it can regognize humanized durations that use abbreviations',
      );
  });

  test<Context>('Passing `maxRange` allows to determine the minimum length of a range (in days)', async function (assert) {
    assert.expect(9);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<Context>(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} @maxRange={{2}} as |cal|>
        <cal.Nav/>
        <cal.Days/>
      </PowerCalendarRange>
    `);

    await click('.ember-power-calendar-day[data-date="2013-10-10"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-10"]')
      .isDisabled('The clicked day is disabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-11"]')
      .isNotDisabled('The next day is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-12"]')
      .isNotDisabled('The next-next day is enabled too');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-13"]')
      .isDisabled('The next-next-next day is disabled');

    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-09"]')
      .isNotDisabled('The prev day is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-08"]')
      .isNotDisabled('The prev-prev day is enabled too');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-07"]')
      .isDisabled('The prev-prev-prev day is disabled');

    await click('.ember-power-calendar-day[data-date="2013-10-12"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-12"]')
      .hasClass('ember-power-calendar-day--selected');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-11"]')
      .hasClass('ember-power-calendar-day--selected', 'the 11th is selected');
  });

  test<Context>('If `publicAPI.action.select` does not invoke the `onSelect` action if the range is smaller than the minRange', async function (assert) {
    assert.expect(2);
    this.selected = { start: new Date(2016, 1, 5), end: null };
    this.invalidDay = {
      number: 6,
      id: '2016-02-06',
      isFocused: false,
      isCurrentMonth: true,
      isToday: false,
      isSelected: false,
      isDisabled: true,
      date: new Date(2016, 1, 6),
    };
    this.validDay = {
      number: 8,
      id: '2016-02-08',
      isFocused: false,
      isCurrentMonth: true,
      isToday: false,
      isSelected: false,
      isDisabled: false,
      date: new Date(2016, 1, 8),
    };
    let range;
    this.onSelect = function (r) {
      range = r;
    };
    await render<Context>(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} @minRange={{2}} as |cal|>
        {{#if cal.actions.select}}
          <button type="button" id="select-invalid-range-end" {{on "click" (fn cal.actions.select this.invalidDay cal)}}>Select invalid date</button>
          <button type="button" id="select-valid-range-end" {{on "click" (fn cal.actions.select this.validDay cal)}}>Select valid date</button>
        {{/if}}
      </PowerCalendarRange>
    `);
    await click('#select-invalid-range-end');
    assert.strictEqual(range, undefined, 'The actions has not been called');
    await click('#select-valid-range-end');
    assert.notEqual(range, undefined, 'The actions has been called now');
  });

  test<Context>('If `publicAPI.action.select` does not invoke the `onSelect` action if the range is bigger than the maxRange', async function (assert) {
    assert.expect(2);

    this.selected = { start: new Date(2016, 1, 5), end: null };
    this.validDay = {
      number: 6,
      id: '2016-02-06',
      isFocused: false,
      isCurrentMonth: true,
      isToday: false,
      isSelected: false,
      isDisabled: false,
      date: new Date(2016, 1, 6),
    };
    this.invalidDay = {
      number: 8,
      id: '2016-02-08',
      isFocused: false,
      isCurrentMonth: true,
      isToday: false,
      isSelected: false,
      isDisabled: true,
      date: new Date(2016, 1, 8),
    };
    let range;
    this.onSelect = function (r) {
      range = r;
    };
    await render<Context>(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} @maxRange={{2}} as |cal|>
        {{#if cal.actions.select}}
          <button type="button" id="select-invalid-range-end" {{on "click" (fn cal.actions.select this.invalidDay cal)}}>Select invalid date</button>
          <button type="button" id="select-valid-range-end" {{on "click" (fn cal.actions.select this.validDay cal)}}>Select valid date</button>
        {{/if}}
      </PowerCalendarRange>
    `);
    await click('#select-invalid-range-end');
    assert.strictEqual(range, undefined, 'The actions has not been called');
    await click('#select-valid-range-end');
    assert.notEqual(range, undefined, 'The actions has been called now');
  });

  test<Context>('when is flagged as proximitySelection it changes range to closest date', async function (assert) {
    assert.expect(7);
    this.selected = { start: new Date(2016, 1, 5), end: new Date(2016, 1, 9) };

    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };

    await render<Context>(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} @proximitySelection={{true}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendarRange>
    `);
    const allDaysInRangeAreSelected =
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2016-02-05"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2016-02-06"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2016-02-07"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2016-02-08"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected') &&
      (
        this.element.querySelector(
          '.ember-power-calendar-day[data-date="2016-02-09"]',
        ) as HTMLElement
      ).classList.contains('ember-power-calendar-day--selected');
    assert.ok(allDaysInRangeAreSelected, 'All days in range are selected');
    assert
      .dom('.ember-power-calendar-day[data-date="2016-02-05"]')
      .hasClass(
        'ember-power-calendar-day--range-start',
        'The start of the range has a special class',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2016-02-09"]')
      .hasClass(
        'ember-power-calendar-day--range-end',
        'The end of the range has a special class',
      );
    await click('.ember-power-calendar-day[data-date="2016-02-10"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2016-02-05"]')
      .hasClass(
        'ember-power-calendar-day--range-start',
        'The start of the range has a special class',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2016-02-10"]')
      .hasClass(
        'ember-power-calendar-day--range-end',
        'The end of the range has a special class',
      );
    await click('.ember-power-calendar-day[data-date="2016-02-04"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2016-02-04"]')
      .hasClass(
        'ember-power-calendar-day--range-start',
        'The start of the range has a special class',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2016-02-10"]')
      .hasClass(
        'ember-power-calendar-day--range-end',
        'The end of the range has a special class',
      );
  });
});
