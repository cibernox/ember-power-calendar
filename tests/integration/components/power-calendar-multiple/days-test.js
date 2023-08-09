import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module(
  'Integration | Component | <PowerCalendarMultiple::Days>',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      let calendarService = this.owner.lookup('service:power-calendar');
      calendarService.set('date', new Date(2013, 9, 18));
    });

    test('The maxLength property sets a maximum number of available days', async function (assert) {
      this.onSelect = (selected) => {
        this.set('collection', selected.date);
      };
      await render(hbs`
      <PowerCalendarMultiple
        @selected={{this.collection}}
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

    test('the maxLength property can handle changing of the property', async function (assert) {
      this.set('max', 1);
      this.onSelect = (selected) => {
        this.set('collection', selected.date);
      };
      await render(hbs`
      <PowerCalendarMultiple
        @selected={{this.collection}}
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

    test('maxLength can handle null for the selected days', async function (assert) {
      this.set('max', 1);
      this.set('collection', null);
      this.onSelect = (selected) => {
        this.set('collection', selected.date);
      };

      await render(hbs`
      <PowerCalendarMultiple
        @selected={{this.collection}}
        @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Days @maxLength={{this.max}}/>
      </PowerCalendarMultiple>
    `);
      await click('.ember-power-calendar-day[data-date="2013-10-05"]');
      this.set('collection', null);
      assert
        .dom('.ember-power-calendar-day[data-date="2013-10-06"]')
        .isNotDisabled();
    });

    test('maxLength can handle null for the maxLength property', async function (assert) {
      this.set('max', null);
      this.onSelect = (selected) => {
        this.set('collection', selected.date);
      };

      await render(hbs`
      <PowerCalendarMultiple
        @selected={{this.collection}}
        @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Days @maxLength={{this.max}}/>
      </PowerCalendarMultiple>
    `);
      await click('.ember-power-calendar-day[data-date="2013-10-05"]');

      assert
        .dom('.ember-power-calendar-day[data-date="2013-10-06"]')
        .isNotDisabled();
    });

    test("If it receives `showDaysAround=false` option, it doesn't show the days before first or after last day of the month", async function (assert) {
      assert.expect(3);
      this.center = new Date(2013, 9, 1);
      this.onSelect = (selected) => {
        this.set('collection', selected.date);
      };
      await render(hbs`
      <PowerCalendarMultiple
        @selected={{this.collection}}
        @center={{this.center}}
        @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Days @showDaysAround={{false}}/>
      </PowerCalendarMultiple>
    `);
      await click('.ember-power-calendar-day[data-date="2013-10-05"]');

      let weeks = this.element.querySelectorAll('.ember-power-calendar-week');
      assert
        .dom('.ember-power-calendar-day', weeks[0])
        .exists({ count: 5 }, 'The first week has 6 days');
      assert.strictEqual(
        weeks[0].dataset.missingDays,
        '2',
        'It has a special data-attribute',
      );
      assert
        .dom('.ember-power-calendar-day', weeks[4])
        .exists({ count: 5 }, 'The last week has 4 days');
    });
  },
);
