import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, type TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import type PowerCalendarService from 'ember-power-calendar/services/power-calendar';
import type { TPowerCalendarMultipleOnSelect } from 'ember-power-calendar/components/power-calendar-multiple';

interface Context extends TestContext {
  element: HTMLElement;
  // minRange?: number | undefined
  center: Date | undefined;
  // rangeToSelect: PowerCalendarDay[];
  // invalidDay: PowerCalendarRangeDay;
  // validDay: PowerCalendarRangeDay;
  // disabledDates: Date[];
  // datesToSelect: PowerCalendarDay[];
  max: number;
  selected: Date[] | undefined;
  // minDate: Date | undefined;
  // maxDate: Date | undefined;
  // onCenterChange: (newCenter: NormalizeCalendarValue, calendar: PowerCalendarAPI, event: MouseEvent | KeyboardEvent) => Promise<void> | void;
  // moveCenter?: (newCenter: NormalizeCalendarValue, calendar: PowerCalendarAPI, event: MouseEvent | KeyboardEvent) => Promise<void> | void;
  onSelect?: TPowerCalendarMultipleOnSelect | undefined;
}

module(
  'Integration | Component | <PowerCalendarMultiple::Days>',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      const calendarService = this.owner.lookup('service:power-calendar') as PowerCalendarService;
      calendarService.set('date', new Date(2013, 9, 18));
    });

    test<Context>('The maxLength property sets a maximum number of available days', async function (assert) {
      this.onSelect = (selected) => {
        this.set('selected', selected.date);
      };
      await render<Context>(hbs`
      <PowerCalendarMultiple
        @selected={{this.selected}}
        @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Days @maxLength={{1}}/>
      </PowerCalendarMultiple>
    `);
      await click('.ember-power-calendar-day[data-date="2013-10-05"]');
      assert
        .dom('.ember-power-calendar-day[data-date="2013-10-05"]')
        .isNotDisabled();
      assert
        .dom('.ember-power-calendar-day[data-date="2013-10-06"]')
        .isDisabled();

      await click('.ember-power-calendar-day[data-date="2013-10-05"]');
      assert
        .dom('.ember-power-calendar-day[data-date="2013-10-05"]')
        .isNotDisabled();
      assert
        .dom('.ember-power-calendar-day[data-date="2013-10-06"]')
        .isNotDisabled();
    });

    test<Context>('the maxLength property can handle changing of the property', async function (assert) {
      this.set('max', 1);
      this.onSelect = (selected) => {
        this.set('selected', selected.date);
      };
      await render<Context>(hbs`
      <PowerCalendarMultiple
        @selected={{this.selected}}
        @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Days @maxLength={{this.max}}/>
      </PowerCalendarMultiple>
    `);
      await click('.ember-power-calendar-day[data-date="2013-10-05"]');
      assert
        .dom('.ember-power-calendar-day[data-date="2013-10-05"]')
        .isNotDisabled();
      assert
        .dom('.ember-power-calendar-day[data-date="2013-10-06"]')
        .isDisabled();

      this.set('max', 2);
      assert
        .dom('.ember-power-calendar-day[data-date="2013-10-06"]')
        .isNotDisabled();
    });

    test<Context>('maxLength can handle null for the selected days', async function (assert) {
      this.set('max', 1);
      this.set('selected', null);
      this.onSelect = (selected) => {
        this.set('selected', selected.date);
      };

      await render<Context>(hbs`
      <PowerCalendarMultiple
        @selected={{this.selected}}
        @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Days @maxLength={{this.max}}/>
      </PowerCalendarMultiple>
    `);
      await click('.ember-power-calendar-day[data-date="2013-10-05"]');
      this.set('selected', null);
      assert
        .dom('.ember-power-calendar-day[data-date="2013-10-06"]')
        .isNotDisabled();
    });

    test<Context>('maxLength can handle null for the maxLength property', async function (assert) {
      this.set('max', null);
      this.onSelect = (selected) => {
        this.set('collection', selected.date);
      };

      await render<Context>(hbs`
      <PowerCalendarMultiple
        @selected={{this.selected}}
        @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Days @maxLength={{this.max}}/>
      </PowerCalendarMultiple>
    `);
      await click('.ember-power-calendar-day[data-date="2013-10-05"]');

      assert
        .dom('.ember-power-calendar-day[data-date="2013-10-06"]')
        .isNotDisabled();
    });

    test<Context>("If it receives `showDaysAround=false` option, it doesn't show the days before first or after last day of the month", async function (assert) {
      assert.expect(3);
      this.center = new Date(2013, 9, 1);
      this.onSelect = (selected) => {
        this.set('selected', selected.date);
      };
      await render<Context>(hbs`
      <PowerCalendarMultiple
        @selected={{this.selected}}
        @center={{this.center}}
        @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Days @showDaysAround={{false}}/>
      </PowerCalendarMultiple>
    `);
      await click('.ember-power-calendar-day[data-date="2013-10-05"]');

      const weeks = this.element.querySelectorAll<HTMLElement>('.ember-power-calendar-week');
      assert
        .dom('.ember-power-calendar-day', weeks[0])
        .exists({ count: 5 }, 'The first week has 6 days');
      assert.strictEqual(
        weeks[0]?.dataset['missingDays'],
        '2',
        'It has a special data-attribute',
      );
      assert
        .dom('.ember-power-calendar-day', weeks[4])
        .exists({ count: 5 }, 'The last week has 4 days');
    });
  },
);
