import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  focus,
  triggerKeyEvent,
  type TestContext,
} from '@ember/test-helpers';
import PowerCalendar from '#src/components/power-calendar.gts';
import PowerCalendarRange from '#src/components/power-calendar-range.gts';
import {
  dependencySatisfies,
  macroCondition,
  importSync,
} from '@embroider/macros';
import type {
  NormalizeCalendarValue,
  SelectedPowerCalendarRange,
} from '#src/utils.ts';
import type {
  PowerCalendarAPI,
  TPowerCalendarOnSelect,
} from '#src/components/power-calendar.gts';
import type * as momentNs from 'moment';
import type { TPowerCalendarRangeOnSelect } from '#src/components/power-calendar-range.gts';
import type PowerCalendarService from '#src/services/power-calendar.ts';
import { timeout } from 'ember-concurrency';
import HostWrapper from '../../../demo-app/components/host-wrapper.gts';
import { getRootNode } from '../../helpers';

let dateLibrary = '';

if (macroCondition(dependencySatisfies('moment', '*'))) {
  dateLibrary = 'moment';
} else if (macroCondition(dependencySatisfies('luxon', '*'))) {
  dateLibrary = 'luxon';
}

interface Context extends TestContext {
  element: HTMLElement;
  center: Date | undefined;
  selected: Date | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  disabledDates: (string | Date)[] | undefined;
  onCenterChange: (
    newCenter: NormalizeCalendarValue,
    calendar: PowerCalendarAPI,
    event: Event,
  ) => Promise<void> | void;
  moveCenter?: (
    newCenter: NormalizeCalendarValue,
    calendar: PowerCalendarAPI,
    event: Event,
  ) => Promise<void> | void;
  onSelect?: TPowerCalendarOnSelect;
}

interface ContextRange extends TestContext {
  element: HTMLElement;
  selected: SelectedPowerCalendarRange | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  onSelect?: TPowerCalendarRangeOnSelect | undefined;
}

module('Integration | Component | <PowerCalendar>', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const calendarService = this.owner.lookup(
      'service:power-calendar',
    ) as PowerCalendarService;
    calendarService.date = new Date(2013, 9, 18);
  });

  test<Context>('Rendered without any arguments, it displays the current month and has no month navigation', async function (assert) {
    assert.expect(3);
    await render(
      <template>
        <HostWrapper>
          <PowerCalendar as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-power-calendar-nav', getRootNode(this.element))
      .containsText('October 2013', 'The calendar is centered in the present');
    assert
      .dom('.ember-power-calendar-nav-control', getRootNode(this.element))
      .doesNotExist('There is no controls to navigate months');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-01"]',
        getRootNode(this.element),
      )
      .exists('The days in the calendar actually belong to the presnet month');
  });

  test<Context>('when rendered without a block, it renders the nav and days components', async function (assert) {
    assert.expect(2);
    await render(
      <template>
        <HostWrapper><PowerCalendar /></HostWrapper>
      </template>,
    );
    assert.dom('.ember-power-calendar-nav', getRootNode(this.element)).exists();
    assert.dom('.ember-power-calendar-day', getRootNode(this.element)).exists();
  });

  test<Context>('when it receives a Date in the `center` argument, it displays that month', async function (assert) {
    const self = this;

    assert.expect(3);
    this.center = new Date(2016, 1, 5);
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar @center={{self.center}} as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-power-calendar-nav', getRootNode(this.element))
      .containsText(
        'February 2016',
        'The calendar is centered in passed month',
      );
    assert
      .dom('.ember-power-calendar-nav-control', getRootNode(this.element))
      .doesNotExist('There is no controls to navigate months');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2016-02-29"]',
        getRootNode(this.element),
      )
      .exists(
        'The days in the calendar actually belong to the displayed month',
      );
  });

  test<Context>('when it receives undefined in the `center` argument, it displays the current month', async function (assert) {
    const self = this;

    assert.expect(3);
    this.center = undefined;
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar @center={{self.center}} as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-power-calendar-nav', getRootNode(this.element))
      .containsText(
        'October 2013',
        'The calendar is centered in current month',
      );
    assert
      .dom('.ember-power-calendar-nav-control', getRootNode(this.element))
      .doesNotExist('There is no controls to navigate months');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-26"]',
        getRootNode(this.element),
      )
      .exists(
        'The days in the calendar actually belong to the displayed month',
      );
  });

  test<Context>('when it receives undefined in the `center` argument, it displays the current month', async function (assert) {
    const self = this;

    assert.expect(3);
    this.center = undefined;
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar @center={{self.center}} as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-power-calendar-nav', getRootNode(this.element))
      .containsText(
        'October 2013',
        'The calendar is centered in current month',
      );
    assert
      .dom('.ember-power-calendar-nav-control', getRootNode(this.element))
      .doesNotExist('There is no controls to navigate months');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-26"]',
        getRootNode(this.element),
      )
      .exists(
        'The days in the calendar actually belong to the displayed month',
      );
  });

  if (dateLibrary === 'moment') {
    let moment: typeof momentNs;
    if (macroCondition(dependencySatisfies('moment', '*'))) {
      moment = (importSync('moment') as { default: typeof momentNs }).default;
    }

    test<Context>('when it receives a `moment()` in the `center` argument, it displays that month', async function (assert) {
      const self = this;

      assert.expect(3);
      this.center = moment('2016-02-05').toDate();
      await render<Context>(
        <template>
          <HostWrapper>
            <PowerCalendar @center={{self.center}} as |calendar|>
              <calendar.Nav />
              <calendar.Days />
            </PowerCalendar>
          </HostWrapper>
        </template>,
      );
      assert
        .dom('.ember-power-calendar-nav', getRootNode(this.element))
        .containsText(
          'February 2016',
          'The calendar is centered in passed month',
        );
      assert
        .dom('.ember-power-calendar-nav-control', getRootNode(this.element))
        .doesNotExist('There is no controls to navigate months');
      assert
        .dom(
          '.ember-power-calendar-day[data-date="2016-02-29"]',
          getRootNode(this.element),
        )
        .exists(
          'The days in the calendar actually belong to the displayed month',
        );
    });

    test<Context>('the `@onCenterChange` action receives the date/moment compound object, the calendar and the event', async function (assert) {
      const self = this;

      assert.expect(3);
      this.center = new Date(2016, 1, 5);
      this.onCenterChange = function (obj, calendar, e) {
        const value = 'moment' in obj && 'date' in obj;
        assert.ok(value, 'The first argument is a compound moment/date object');
        // @ts-expect-error Unsafe call of a(n) `error` type typed value.

        assert.isCalendar(
          calendar,
          "The second argument is the calendar's public API",
        );
        assert.ok(e instanceof Event, 'The third argument is an event');
      };
      await render<Context>(
        <template>
          <HostWrapper>
            <PowerCalendar
              @center={{self.center}}
              @onCenterChange={{self.onCenterChange}}
              as |calendar|
            >
              <calendar.Nav />
              <calendar.Days />
            </PowerCalendar>
          </HostWrapper>
        </template>,
      );

      await click(
        getRootNode(this.element).querySelector(
          '.ember-power-calendar-nav-control--next',
        ) as HTMLElement,
      );
    });

    test<Context>('when it receives a `moment` in the `selected` argument, it displays that month, and that day is marked as selected', async function (assert) {
      const self = this;

      assert.expect(4);
      this.selected = moment('2016-02-05').toDate();
      await render<Context>(
        <template>
          <HostWrapper>
            <PowerCalendar @selected={{self.selected}} as |calendar|>
              <calendar.Nav />
              <calendar.Days />
            </PowerCalendar>
          </HostWrapper>
        </template>,
      );
      assert
        .dom('.ember-power-calendar-nav', getRootNode(this.element))
        .containsText(
          'February 2016',
          'The calendar is centered in the month of the selected date',
        );
      assert
        .dom(
          '.ember-power-calendar-day[data-date="2016-02-29"]',
          getRootNode(this.element),
        )
        .exists(
          'The days in the calendar actually belong to the displayed month',
        );
      assert
        .dom('.ember-power-calendar-day--selected', getRootNode(this.element))
        .exists('There is one day marked as selected');
      assert
        .dom('.ember-power-calendar-day--selected', getRootNode(this.element))
        .hasAttribute(
          'data-date',
          '2016-02-05',
          'The passed `selected` is the selected day',
        );
    });
  } else if (dateLibrary === 'luxon') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let DateTime: any;

    if (macroCondition(dependencySatisfies('luxon', '*'))) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      DateTime = (importSync('luxon') as { default: any }).default.DateTime;
    }

    test<Context>('when it receives a DateTime in the `center` argument, it displays that month', async function (assert) {
      const self = this;

      assert.expect(3);

      this.center = DateTime.fromObject({
        year: 2016,
        month: 2,
        day: 5,
      }) as Date;
      await render<Context>(
        <template>
          <HostWrapper>
            <PowerCalendar @center={{self.center}} as |calendar|>
              <calendar.Nav />
              <calendar.Days />
            </PowerCalendar>
          </HostWrapper>
        </template>,
      );
      assert
        .dom('.ember-power-calendar-nav', getRootNode(this.element))
        .containsText(
          'February 2016',
          'The calendar is centered in passed month',
        );
      assert
        .dom('.ember-power-calendar-nav-control', getRootNode(this.element))
        .doesNotExist('There is no controls to navigate months');
      assert
        .dom(
          '.ember-power-calendar-day[data-date="2016-02-29"]',
          getRootNode(this.element),
        )
        .exists(
          'The days in the calendar actually belong to the displayed month',
        );
    });

    test<Context>('the `@onCenterChange` action receives the date/datetime compound object, the calendar and the event', async function (assert) {
      const self = this;

      assert.expect(3);
      this.center = new Date(2016, 1, 5);
      this.onCenterChange = function (obj, calendar, e) {
        const value = 'datetime' in obj && 'date' in obj;
        assert.ok(
          value,
          'The first argument is a compound date/datetime object',
        );
        // @ts-expect-error Unsafe call of a(n) `error` type typed value.

        assert.isCalendar(
          calendar,
          "The second argument is the calendar's public API",
        );
        assert.ok(e instanceof Event, 'The third argument is an event');
      };
      await render<Context>(
        <template>
          <HostWrapper>
            <PowerCalendar
              @center={{self.center}}
              @onCenterChange={{self.onCenterChange}}
              as |calendar|
            >
              <calendar.Nav />
              <calendar.Days />
            </PowerCalendar>
          </HostWrapper>
        </template>,
      );

      await click(
        getRootNode(this.element).querySelector(
          '.ember-power-calendar-nav-control--next',
        ) as HTMLElement,
      );
    });

    test<Context>('when it receives a DateTime in the `selected` argument, it displays that month, and that day is marked as selected', async function (assert) {
      const self = this;

      assert.expect(4);

      this.selected = DateTime.fromObject({
        year: 2016,
        month: 2,
        day: 5,
      }) as Date;
      await render<Context>(
        <template>
          <HostWrapper>
            <PowerCalendar @selected={{self.selected}} as |calendar|>
              <calendar.Nav />
              <calendar.Days />
            </PowerCalendar>
          </HostWrapper>
        </template>,
      );
      assert
        .dom('.ember-power-calendar-nav', getRootNode(this.element))
        .containsText(
          'February 2016',
          'The calendar is centered in the month of the selected date',
        );
      assert
        .dom(
          '.ember-power-calendar-day[data-date="2016-02-29"]',
          getRootNode(this.element),
        )
        .exists(
          'The days in the calendar actually belong to the displayed month',
        );
      assert
        .dom('.ember-power-calendar-day--selected', getRootNode(this.element))
        .exists('There is one day marked as selected');
      assert
        .dom('.ember-power-calendar-day--selected', getRootNode(this.element))
        .hasAttribute(
          'data-date',
          '2016-02-05',
          'The passed `selected` is the selected day',
        );
    });
  }

  test<Context>('when it receives a `center` and an `@onCenterChange` action, it shows controls to go to the next & previous month and the action is called when they are clicked', async function (assert) {
    const self = this;

    assert.expect(7);
    this.center = new Date(2016, 1, 5);
    this.moveCenter = function () {
      assert.ok(true, 'The moveCenter action is invoked');
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar
            @center={{self.center}}
            @onCenterChange={{self.moveCenter}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-power-calendar-nav', getRootNode(this.element))
      .containsText(
        'February 2016',
        'The calendar is centered in passed month',
      );
    assert
      .dom(
        '.ember-power-calendar-nav-control--previous',
        getRootNode(this.element),
      )
      .exists('There is a control to go to previous month');
    assert
      .dom('.ember-power-calendar-nav-control--next', getRootNode(this.element))
      .exists('There is a control to go to next month');

    await click(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-nav-control--previous',
      ) as HTMLElement,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-nav-control--next',
      ) as HTMLElement,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-nav-control--next',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-power-calendar-nav', getRootNode(this.element))
      .containsText(
        'February 2016',
        'The calendar is still centered in the the passed month',
      );
  });

  test<Context>('when the `@onCenterChange` action changes the `center` attribute, the calendar shows the new month', async function (assert) {
    const self = this;

    assert.expect(2);
    this.center = new Date(2016, 1, 5);
    this.onCenterChange = (selected) => {
      this.set('center', selected.date);
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar
            @center={{self.center}}
            @onCenterChange={{self.onCenterChange}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );

    assert
      .dom('.ember-power-calendar-nav', getRootNode(this.element))
      .containsText(
        'February 2016',
        'The calendar is centered in passed month',
      );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-nav-control--next',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-power-calendar-nav', getRootNode(this.element))
      .containsText('March 2016', 'The calendar is centered in next month');
  });

  test<Context>('when the `@onCenterChange` action changes the `center` and the passed center was null, the calendar shows the new month', async function (assert) {
    const self = this;

    assert.expect(2);
    this.center = undefined;
    this.onCenterChange = (selected) => {
      this.set('center', selected.date);
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar
            @center={{self.center}}
            @onCenterChange={{self.onCenterChange}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );

    assert
      .dom('.ember-power-calendar-nav', getRootNode(this.element))
      .containsText(
        'October 2013',
        'The calendar is centered in current month',
      );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-nav-control--next',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-power-calendar-nav', getRootNode(this.element))
      .containsText(
        'November 2013',
        'The calendar is centered in the next month',
      );
  });

  test<Context>('when it receives a Date in the `selected` argument, it displays that month, and that day is marked as selected', async function (assert) {
    const self = this;

    assert.expect(4);
    this.selected = new Date(2016, 1, 5);
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar @selected={{self.selected}} as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-power-calendar-nav', getRootNode(this.element))
      .containsText(
        'February 2016',
        'The calendar is centered in the month of the selected date',
      );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2016-02-29"]',
        getRootNode(this.element),
      )
      .exists(
        'The days in the calendar actually belong to the displayed month',
      );
    assert
      .dom('.ember-power-calendar-day--selected', getRootNode(this.element))
      .exists('There is one day marked as selected');
    assert
      .dom('.ember-power-calendar-day--selected', getRootNode(this.element))
      .hasAttribute(
        'data-date',
        '2016-02-05',
        'The passed `selected` is the selected day',
      );
  });

  test<Context>('when it receives both `selected` and `center`, `center` trumps and that month is displayed', async function (assert) {
    const self = this;

    assert.expect(4);
    this.selected = new Date(2016, 2, 5);
    this.center = new Date(2016, 1, 5);
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar
            @selected={{self.selected}}
            @center={{self.center}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    assert
      .dom('.ember-power-calendar-nav', getRootNode(this.element))
      .containsText(
        'February 2016',
        'The calendar is centered in the `center`, no on the `selected` date',
      );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2016-02-29"]',
        getRootNode(this.element),
      )
      .exists(
        'The days in the calendar actually belong to the displayed month',
      );
    assert
      .dom('.ember-power-calendar-day--selected', getRootNode(this.element))
      .exists('There is one day marked as selected');
    assert
      .dom('.ember-power-calendar-day--selected', getRootNode(this.element))
      .hasAttribute(
        'data-date',
        '2016-03-05',
        'The passed `selected` is the selected day',
      );
  });

  test<Context>("The days that belong to the currently displayed month have a distintive class that the days belonging to the previous/next month don't", async function (assert) {
    assert.expect(4);
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-01"]',
        getRootNode(this.element),
      )
      .hasClass(
        'ember-power-calendar-day--current-month',
        'Days of the current month have this class',
      );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-31"]',
        getRootNode(this.element),
      )
      .hasClass(
        'ember-power-calendar-day--current-month',
        'Days of the current month have this class',
      );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-09-30"]',
        getRootNode(this.element),
      )
      .hasNoClass(
        'ember-power-calendar-day--current-month',
        "Days of the previous month don't",
      );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-11-01"]',
        getRootNode(this.element),
      )
      .hasNoClass(
        'ember-power-calendar-day--current-month',
        "Days of the previous month don't",
      );
  });

  test<Context>("The current day has a special class that other days don't", async function (assert) {
    assert.expect(3);
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
        getRootNode(this.element),
      )
      .hasClass(
        'ember-power-calendar-day--today',
        'The current day has a special class',
      );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-19"]',
        getRootNode(this.element),
      )
      .hasNoClass('ember-power-calendar-day--today');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-17"]',
        getRootNode(this.element),
      )
      .hasNoClass('ember-power-calendar-day--today');
  });

  test<Context>('If there is no `onSelect` action, days are disabled', async function (assert) {
    assert.expect(1);
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
        getRootNode(this.element),
      )
      .hasAttribute('disabled');
  });

  test<Context>('If there is an `onSelect` action, days can be focused', async function (assert) {
    const self = this;

    assert.expect(1);
    this.onSelect = () => {};
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar @onSelect={{self.onSelect}} as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    const dayElement = getRootNode(this.element).querySelector(
      '.ember-power-calendar-day[data-date="2013-10-18"]',
    );

    await focus(dayElement as HTMLElement);
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      dayElement,
    );
  });

  test<Context>('If a day is focused, it gets a special hasClass', async function (assert) {
    const self = this;

    assert.expect(3);
    this.onSelect = () => {};
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar @onSelect={{self.onSelect}} as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    const dayElement = getRootNode(this.element).querySelector(
      '.ember-power-calendar-day[data-date="2013-10-18"]',
    );
    await focus(dayElement as HTMLElement);
    assert
      .dom(dayElement)
      .hasClass(
        'ember-power-calendar-day--focused',
        'The focused day gets a special class',
      );
    const anotherDayElement = getRootNode(this.element).querySelector(
      '.ember-power-calendar-day[data-date="2013-10-21"]',
    );
    await focus(anotherDayElement as HTMLElement);
    assert
      .dom(dayElement)
      .hasNoClass(
        'ember-power-calendar-day--focused',
        'The focused day gets a special class',
      );
    assert
      .dom(anotherDayElement)
      .hasClass(
        'ember-power-calendar-day--focused',
        'The focused day gets a special class',
      );
  });

  test<Context>('Clicking one day, triggers the `onSelect` action with that day (which is a object with some basic information)', async function (assert) {
    const self = this;

    assert.expect(3);
    this.onSelect = function (day, calendar, e) {
      // @ts-expect-error Unsafe call of a(n) `error` type typed value.

      assert.isDay(day, 'The first argument is a day object');
      // @ts-expect-error Unsafe call of a(n) `error` type typed value.

      assert.isCalendar(
        calendar,
        "The second argument is the calendar's public API",
      );
      assert.ok(e instanceof Event, 'The third argument is an event');
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar @onSelect={{self.onSelect}} as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    await click(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ) as HTMLElement,
    );
  });

  test<Context>('If the `onSelect` updates the selected value, it can work as a date-selector', async function (assert) {
    const self = this;

    assert.expect(2);
    this.selected = new Date(2016, 1, 5);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar
            @selected={{self.selected}}
            @onSelect={{self.onSelect}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );

    assert
      .dom('.ember-power-calendar-day--selected', getRootNode(this.element))
      .hasAttribute('data-date', '2016-02-05');
    await click(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2016-02-21"]',
      ) as HTMLElement,
    );
    assert
      .dom('.ember-power-calendar-day--selected', getRootNode(this.element))
      .hasAttribute('data-date', '2016-02-21');
  });

  test<Context>('If a day is focused, using left/right arrow keys focuses the previous/next day', async function (assert) {
    const self = this;

    assert.expect(6);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar @onSelect={{self.onSelect}} as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );

    await focus(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ) as HTMLElement,
    );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ),
    );

    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ) as HTMLElement,
      'keydown',
      37,
    ); // left arrow
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-17"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-17"]',
      ),
    );

    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-17"]',
      ) as HTMLElement,
      'keydown',
      39,
    ); // right arrow
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ),
    );
  });

  test<Context>('If a day is focused, using up/down arrow keys focuses the same weekday of the previous/next week', async function (assert) {
    const self = this;

    assert.expect(6);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar @onSelect={{self.onSelect}} as |calendar|>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    await focus(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ) as HTMLElement,
    );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ),
    );

    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ) as HTMLElement,
      'keydown',
      38,
    ); // left arrow
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-11"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-11"]',
      ),
    );

    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-17"]',
      ) as HTMLElement,
      'keydown',
      40,
    ); // right arrow
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ),
    );
  });

  test<Context>('If the `@onCenterChange` action returns a `thenable`, the component enter loading state while that thenable resolves or rejects', async function (assert) {
    const self = this;

    assert.expect(2);
    const done = assert.async();
    this.onCenterChange = async () => {
      await timeout(200);
      return Promise.resolve();
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar @onCenterChange={{self.onCenterChange}} as |calendar|>
            <div class={{if calendar.loading "is-loading-yo"}}></div>
            <calendar.Nav />
            <calendar.Days />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );

    setTimeout(() => {
      assert
        .dom('.is-loading-yo', getRootNode(this.element))
        .exists('The component is in a loading state');
    }, 100);

    await click(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-nav-control--next',
      ) as HTMLElement,
    );

    setTimeout(() => {
      assert
        .dom('.is-loading-yo', getRootNode(this.element))
        .doesNotExist('The component is not in a loading state anymore');
      done();
    }, 250);
  });

  test<Context>('If the calendar without `onSelect` receives a block on the `days` component, that block is used to render each one of the days of the cell', async function (assert) {
    assert.expect(1);
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar as |calendar|>
            <calendar.Days as |day|>
              {{day.number}}!
            </calendar.Days>
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-01"]',
        getRootNode(this.element),
      )
      .hasText('1!', 'The block has been rendered');
  });

  test<Context>('If the calendar with `onSelect` receives a block on the `days` component, that block is used to render each one of the days of the cell', async function (assert) {
    const self = this;

    assert.expect(1);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar
            @selected={{self.selected}}
            @onSelect={{self.onSelect}}
            as |calendar|
          >
            <calendar.Days as |day|>
              {{day.number}}!
            </calendar.Days>
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-01"]',
        getRootNode(this.element),
      )
      .hasText('1!', 'The block has been rendered');
  });

  test<Context>('If the user passes `minDate=someDate` to single calendars, days before that one cannot be selected, but that day and those after can', async function (assert) {
    const self = this;

    assert.expect(6);
    this.minDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar
            @selected={{self.selected}}
            @onSelect={{self.onSelect}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days @minDate={{self.minDate}} />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-14"]',
        getRootNode(this.element),
      )
      .isDisabled('Days before the minDate are disabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The minDate is selectable');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-16"]',
        getRootNode(this.element),
      )
      .isNotDisabled('Days after the minDate are selectable');

    this.set('minDate', new Date(2013, 9, 18));
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-14"]',
        getRootNode(this.element),
      )
      .isDisabled('Days before the minDate are disabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-17"]',
        getRootNode(this.element),
      )
      .isDisabled('The minDate is selectable');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
        getRootNode(this.element),
      )
      .isNotDisabled('Days after the minDate are selectable');
  });

  test<Context>('If the user passes `@maxDate={{someDate}}` to single calendars, days after that one cannot be selected, but that day and those days before can', async function (assert) {
    const self = this;

    assert.expect(6);
    this.maxDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar
            @selected={{self.selected}}
            @onSelect={{self.onSelect}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days @maxDate={{self.maxDate}} />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-14"]',
        getRootNode(this.element),
      )
      .isNotDisabled('Days before the maxDate are selectable');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The maxDate is selectable');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-16"]',
        getRootNode(this.element),
      )
      .isDisabled('Days after the maxDate are disabled');

    this.set('maxDate', new Date(2013, 9, 18));
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-17"]',
        getRootNode(this.element),
      )
      .isNotDisabled('Days before the maxDate are selectable');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The maxDate is selectable');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-19"]',
        getRootNode(this.element),
      )
      .isDisabled('Days after the maxDate are disabled');
  });

  test<ContextRange>('If the user passes `minDate=someDate` to range calendars, days before that one cannot be selected, but that day and those after can', async function (assert) {
    const self = this;

    assert.expect(3);
    this.minDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<ContextRange>(
      <template>
        <HostWrapper>
          <PowerCalendarRange
            @selected={{self.selected}}
            @onSelect={{self.onSelect}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days @minDate={{self.minDate}} />
          </PowerCalendarRange>
        </HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-14"]',
        getRootNode(this.element),
      )
      .isDisabled('Days before the minDate are disabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The minDate is selectable');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-16"]',
        getRootNode(this.element),
      )
      .isNotDisabled('Days after the minDate are selectable');
  });

  test<ContextRange>('If the user passes `maxDate=someDate` to range calendars, days after that one cannot be selected, but that day and those days before can', async function (assert) {
    const self = this;

    assert.expect(3);
    this.maxDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<ContextRange>(
      <template>
        <HostWrapper>
          <PowerCalendarRange
            @selected={{self.selected}}
            @onSelect={{self.onSelect}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days @maxDate={{self.maxDate}} />
          </PowerCalendarRange>
        </HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-14"]',
        getRootNode(this.element),
      )
      .isNotDisabled('Days before the maxDate are selectable');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The maxDate is selectable');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-16"]',
        getRootNode(this.element),
      )
      .isDisabled('Days after the maxDate are disabled');
  });

  test<Context>('If the user passes `disabledDates=someDate` to single calendars, days on those days are disabled', async function (assert) {
    const self = this;

    assert.expect(20);
    this.disabledDates = [
      new Date(2013, 9, 15),
      new Date(2013, 9, 17),
      new Date(2013, 9, 21),
      new Date(2013, 9, 23),
    ];
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <PowerCalendar
            @selected={{self.selected}}
            @onSelect={{self.onSelect}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days @disabledDates={{self.disabledDates}} />
          </PowerCalendar>
        </HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-14"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 14th is enabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .isDisabled('The 15th is disabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-14"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 16th is enabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-17"]',
        getRootNode(this.element),
      )
      .isDisabled('The 17th is disabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-21"]',
        getRootNode(this.element),
      )
      .isDisabled('The 21st is disabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-23"]',
        getRootNode(this.element),
      )
      .isDisabled('The 23rd is disabled');

    this.set('disabledDates', [new Date(2013, 9, 22)]);
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-14"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 14th is enabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 15th is enabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-14"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 16th is enabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-17"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 17th is enabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-21"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 21st is enabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-23"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 23rd is enabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-23"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 22nd is disabled');

    this.set('disabledDates', [new Date(2013, 9, 22), 'Tue', 'Thu', 'Sun']);

    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-14"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 14th is enabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .isDisabled('The 15th is disabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-14"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 16th is enabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-17"]',
        getRootNode(this.element),
      )
      .isDisabled('The 17th is disabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-21"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 21st is enabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-23"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 23rd is enabled');
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-23"]',
        getRootNode(this.element),
      )
      .isNotDisabled('The 22nd is disabled');
  });

  test<ContextRange>('When the user tries to focus a disabled date with the left arrow key, the focus stays where it is', async function (assert) {
    const self = this;

    assert.expect(4);
    this.minDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<ContextRange>(
      <template>
        <HostWrapper>
          <PowerCalendarRange
            @selected={{self.selected}}
            @onSelect={{self.onSelect}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days @minDate={{self.minDate}} />
          </PowerCalendarRange>
        </HostWrapper>
      </template>,
    );

    await focus(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ) as HTMLElement,
    );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ),
    );

    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ) as HTMLElement,
      'keydown',
      37,
    ); // left arrow
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ),
    );
  });

  test<ContextRange>('When the user tries to focus a disabled date with the up arrow key, the focus goes to the latest selectable day', async function (assert) {
    const self = this;

    assert.expect(4);
    this.minDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<ContextRange>(
      <template>
        <HostWrapper>
          <PowerCalendarRange
            @selected={{self.selected}}
            @onSelect={{self.onSelect}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days @minDate={{self.minDate}} />
          </PowerCalendarRange>
        </HostWrapper>
      </template>,
    );

    await focus(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ) as HTMLElement,
    );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ),
    );

    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ) as HTMLElement,
      'keydown',
      38,
    ); // up arrow
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ),
    );
  });

  test<ContextRange>('When the user tries to focus a disabled date with the right arrow key, the focus stays where it is', async function (assert) {
    const self = this;

    assert.expect(4);
    this.maxDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<ContextRange>(
      <template>
        <HostWrapper>
          <PowerCalendarRange
            @selected={{self.selected}}
            @onSelect={{self.onSelect}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days @maxDate={{self.maxDate}} />
          </PowerCalendarRange>
        </HostWrapper>
      </template>,
    );

    await focus(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ) as HTMLElement,
    );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ),
    );

    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ) as HTMLElement,
      'keydown',
      39,
    ); // right arrow
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ),
    );
  });

  test<ContextRange>('When the user tries to focus a disabled date with the down arrow key, the focus goes to the latest selectable day', async function (assert) {
    const self = this;

    assert.expect(4);
    this.maxDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render<ContextRange>(
      <template>
        <HostWrapper>
          <PowerCalendarRange
            @selected={{self.selected}}
            @onSelect={{self.onSelect}}
            as |calendar|
          >
            <calendar.Nav />
            <calendar.Days @maxDate={{self.maxDate}} />
          </PowerCalendarRange>
        </HostWrapper>
      </template>,
    );

    await focus(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-11"]',
      ) as HTMLElement,
    );
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-11"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-11"]',
      ),
    );

    await triggerKeyEvent(
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-11"]',
      ) as HTMLElement,
      'keydown',
      40,
    ); // down arrow
    assert
      .dom(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      (getRootNode(this.element) as unknown as ShadowRoot).activeElement,
      getRootNode(this.element).querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ),
    );
  });

  test<Context>('user can provide `@tag` attribute', async function (assert) {
    assert.expect(1);
    await render<Context>(
      <template>
        <HostWrapper><PowerCalendar @tag="li" /></HostWrapper>
      </template>,
    );
    assert
      .dom('li.ember-power-calendar', getRootNode(this.element))
      .exists('default `div` overwritten with `li`');
  });

  // test<Context>('user can provide empty `@tag` attribute', async function (assert) {
  //   assert.expect(1);
  //   await render<Context>(hbs`
  //     <PowerCalendar @tag="" />
  //   `);
  //   assert
  //     .dom('.ember-power-calendar', getRootNode(this.element))
  //     .doesNotExist('default `div` overwritten');
  // });
});
