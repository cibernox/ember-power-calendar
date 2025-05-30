import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, focus, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { run, later } from '@ember/runloop';
import RSVP from 'rsvp';
import {
  dependencySatisfies,
  macroCondition,
  importSync,
} from '@embroider/macros';
import ownProp from 'test-app/utils/own-prop';

let dateLibrary = '';

if (macroCondition(dependencySatisfies('moment', '*'))) {
  dateLibrary = 'moment';
} else if (macroCondition(dependencySatisfies('luxon', '*'))) {
  dateLibrary = 'luxon';
}

console.log(dateLibrary);

module('Integration | Component | <PowerCalendar>', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    let calendarService = this.owner.lookup('service:power-calendar');
    calendarService.set('date', new Date(2013, 9, 18));
  });

  test('Rendered without any arguments, it displays the current month and has no month navigation', async function (assert) {
    assert.expect(3);
    await render(hbs`
      <PowerCalendar as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    assert
      .dom('.ember-power-calendar-nav')
      .containsText('October 2013', 'The calendar is centered in the present');
    assert
      .dom('.ember-power-calendar-nav-control')
      .doesNotExist('There is no controls to navigate months');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-01"]')
      .exists('The days in the calendar actually belong to the presnet month');
  });

  test('when rendered without a block, it renders the nav and days components', async function (assert) {
    assert.expect(2);
    await render(hbs`<PowerCalendar />`);
    assert.dom('.ember-power-calendar-nav').exists();
    assert.dom('.ember-power-calendar-day').exists();
  });

  test('when it receives a Date in the `center` argument, it displays that month', async function (assert) {
    assert.expect(3);
    this.center = new Date(2016, 1, 5);
    await render(hbs`
      <PowerCalendar @center={{this.center}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    assert
      .dom('.ember-power-calendar-nav')
      .containsText(
        'February 2016',
        'The calendar is centered in passed month',
      );
    assert
      .dom('.ember-power-calendar-nav-control')
      .doesNotExist('There is no controls to navigate months');
    assert
      .dom('.ember-power-calendar-day[data-date="2016-02-29"]')
      .exists(
        'The days in the calendar actually belong to the displayed month',
      );
  });

  test('when it receives null in the `center` argument, it displays the current month', async function (assert) {
    assert.expect(3);
    this.center = null;
    await render(hbs`
      <PowerCalendar @center={{this.center}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    assert
      .dom('.ember-power-calendar-nav')
      .containsText(
        'October 2013',
        'The calendar is centered in current month',
      );
    assert
      .dom('.ember-power-calendar-nav-control')
      .doesNotExist('There is no controls to navigate months');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-26"]')
      .exists(
        'The days in the calendar actually belong to the displayed month',
      );
  });

  test('when it receives undefined in the `center` argument, it displays the current month', async function (assert) {
    assert.expect(3);
    this.center = undefined;
    await render(hbs`
      <PowerCalendar @center={{this.center}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    assert
      .dom('.ember-power-calendar-nav')
      .containsText(
        'October 2013',
        'The calendar is centered in current month',
      );
    assert
      .dom('.ember-power-calendar-nav-control')
      .doesNotExist('There is no controls to navigate months');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-26"]')
      .exists(
        'The days in the calendar actually belong to the displayed month',
      );
  });

  if (dateLibrary === 'moment') {
    let moment;
    if (macroCondition(dependencySatisfies('moment', '*'))) {
      moment = importSync('moment').default;
    }

    test('when it receives a `moment()` in the `center` argument, it displays that month', async function (assert) {
      assert.expect(3);
      this.center = moment('2016-02-05');
      await render(hbs`
        <PowerCalendar @center={{this.center}} as |calendar|>
          <calendar.Nav/>
          <calendar.Days/>
        </PowerCalendar>
      `);
      assert
        .dom('.ember-power-calendar-nav')
        .containsText(
          'February 2016',
          'The calendar is centered in passed month',
        );
      assert
        .dom('.ember-power-calendar-nav-control')
        .doesNotExist('There is no controls to navigate months');
      assert
        .dom('.ember-power-calendar-day[data-date="2016-02-29"]')
        .exists(
          'The days in the calendar actually belong to the displayed month',
        );
    });

    test('the `@onCenterChange` action receives the date/moment compound object, the calendar and the event', async function (assert) {
      assert.expect(3);
      this.center = new Date(2016, 1, 5);
      this.onCenterChange = function (obj, calendar, e) {
        const value = ownProp(obj, 'moment') && ownProp(obj, 'date');
        assert.ok(value, 'The first argument is a compound moment/date object');
        assert.isCalendar(
          calendar,
          "The second argument is the calendar's public API",
        );
        assert.ok(e instanceof Event, 'The third argument is an event');
      };
      await render(hbs`
      <PowerCalendar @center={{this.center}} @onCenterChange={{this.onCenterChange}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);

      await click('.ember-power-calendar-nav-control--next');
    });

    test('when it receives a `moment` in the `selected` argument, it displays that month, and that day is marked as selected', async function (assert) {
      assert.expect(4);
      this.selected = moment('2016-02-05');
      await render(hbs`
      <PowerCalendar @selected={{this.selected}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
      assert
        .dom('.ember-power-calendar-nav')
        .containsText(
          'February 2016',
          'The calendar is centered in the month of the selected date',
        );
      assert
        .dom('.ember-power-calendar-day[data-date="2016-02-29"]')
        .exists(
          'The days in the calendar actually belong to the displayed month',
        );
      assert
        .dom('.ember-power-calendar-day--selected')
        .exists('There is one day marked as selected');
      assert
        .dom('.ember-power-calendar-day--selected')
        .hasAttribute(
          'data-date',
          '2016-02-05',
          'The passed `selected` is the selected day',
        );
    });
  } else if (dateLibrary === 'luxon') {
    let DateTime;

    if (macroCondition(dependencySatisfies('luxon', '*'))) {
      DateTime = importSync('luxon').default.DateTime;
    }

    test('when it receives a DateTime in the `center` argument, it displays that month', async function (assert) {
      assert.expect(3);
      this.center = DateTime.fromObject({ year: 2016, month: 2, day: 5 });
      await render(hbs`
        <PowerCalendar @center={{this.center}} as |calendar|>
          <calendar.Nav/>
          <calendar.Days/>
        </PowerCalendar>
      `);
      assert
        .dom('.ember-power-calendar-nav')
        .containsText(
          'February 2016',
          'The calendar is centered in passed month',
        );
      assert
        .dom('.ember-power-calendar-nav-control')
        .doesNotExist('There is no controls to navigate months');
      assert
        .dom('.ember-power-calendar-day[data-date="2016-02-29"]')
        .exists(
          'The days in the calendar actually belong to the displayed month',
        );
    });

    test('the `@onCenterChange` action receives the date/datetime compound object, the calendar and the event', async function (assert) {
      assert.expect(3);
      this.center = new Date(2016, 1, 5);
      this.onCenterChange = function (obj, calendar, e) {
        const value = ownProp(obj, 'datetime') && ownProp(obj, 'date');
        assert.ok(
          value,
          'The first argument is a compound date/datetime object',
        );
        assert.isCalendar(
          calendar,
          "The second argument is the calendar's public API",
        );
        assert.ok(e instanceof Event, 'The third argument is an event');
      };
      await render(hbs`
      <PowerCalendar @center={{this.center}} @onCenterChange={{this.onCenterChange}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);

      await click('.ember-power-calendar-nav-control--next');
    });

    test('when it receives a DateTime in the `selected` argument, it displays that month, and that day is marked as selected', async function (assert) {
      assert.expect(4);
      this.selected = DateTime.fromObject({ year: 2016, month: 2, day: 5 });
      await render(hbs`
      <PowerCalendar @selected={{this.selected}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
      assert
        .dom('.ember-power-calendar-nav')
        .containsText(
          'February 2016',
          'The calendar is centered in the month of the selected date',
        );
      assert
        .dom('.ember-power-calendar-day[data-date="2016-02-29"]')
        .exists(
          'The days in the calendar actually belong to the displayed month',
        );
      assert
        .dom('.ember-power-calendar-day--selected')
        .exists('There is one day marked as selected');
      assert
        .dom('.ember-power-calendar-day--selected')
        .hasAttribute(
          'data-date',
          '2016-02-05',
          'The passed `selected` is the selected day',
        );
    });
  }

  test('when it receives a `center` and an `@onCenterChange` action, it shows controls to go to the next & previous month and the action is called when they are clicked', async function (assert) {
    assert.expect(7);
    this.center = new Date(2016, 1, 5);
    this.moveCenter = function () {
      assert.ok(true, 'The moveCenter action is invoked');
    };
    await render(hbs`
      <PowerCalendar @center={{this.center}} @onCenterChange={{this.moveCenter}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    assert
      .dom('.ember-power-calendar-nav')
      .containsText(
        'February 2016',
        'The calendar is centered in passed month',
      );
    assert
      .dom('.ember-power-calendar-nav-control--previous')
      .exists('There is a control to go to previous month');
    assert
      .dom('.ember-power-calendar-nav-control--next')
      .exists('There is a control to go to next month');

    await click('.ember-power-calendar-nav-control--previous');
    await click('.ember-power-calendar-nav-control--next');
    await click('.ember-power-calendar-nav-control--next');
    assert
      .dom('.ember-power-calendar-nav')
      .containsText(
        'February 2016',
        'The calendar is still centered in the the passed month',
      );
  });

  test('when the `@onCenterChange` action changes the `center` attribute, the calendar shows the new month', async function (assert) {
    assert.expect(2);
    this.center = new Date(2016, 1, 5);
    this.onCenterChange = (selected) => {
      this.set('center', selected.date);
    };
    await render(hbs`
      <PowerCalendar @center={{this.center}} @onCenterChange={{this.onCenterChange}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);

    assert
      .dom('.ember-power-calendar-nav')
      .containsText(
        'February 2016',
        'The calendar is centered in passed month',
      );
    await click('.ember-power-calendar-nav-control--next');
    assert
      .dom('.ember-power-calendar-nav')
      .containsText('March 2016', 'The calendar is centered in next month');
  });

  test('when the `@onCenterChange` action changes the `center` and the passed center was null, the calendar shows the new month', async function (assert) {
    assert.expect(2);
    this.center = null;
    this.onCenterChange = (selected) => {
      this.set('center', selected.date);
    };
    await render(hbs`
      <PowerCalendar @center={{this.center}} @onCenterChange={{this.onCenterChange}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);

    assert
      .dom('.ember-power-calendar-nav')
      .containsText(
        'October 2013',
        'The calendar is centered in current month',
      );
    await click('.ember-power-calendar-nav-control--next');
    assert
      .dom('.ember-power-calendar-nav')
      .containsText(
        'November 2013',
        'The calendar is centered in the next month',
      );
  });

  test('when it receives a Date in the `selected` argument, it displays that month, and that day is marked as selected', async function (assert) {
    assert.expect(4);
    this.selected = new Date(2016, 1, 5);
    await render(hbs`
      <PowerCalendar @selected={{this.selected}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    assert
      .dom('.ember-power-calendar-nav')
      .containsText(
        'February 2016',
        'The calendar is centered in the month of the selected date',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2016-02-29"]')
      .exists(
        'The days in the calendar actually belong to the displayed month',
      );
    assert
      .dom('.ember-power-calendar-day--selected')
      .exists('There is one day marked as selected');
    assert
      .dom('.ember-power-calendar-day--selected')
      .hasAttribute(
        'data-date',
        '2016-02-05',
        'The passed `selected` is the selected day',
      );
  });

  test('when it receives both `selected` and `center`, `center` trumps and that month is displayed', async function (assert) {
    assert.expect(4);
    this.selected = new Date(2016, 2, 5);
    this.center = new Date(2016, 1, 5);
    await render(hbs`
      <PowerCalendar @selected={{this.selected}} @center={{this.center}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    assert
      .dom('.ember-power-calendar-nav')
      .containsText(
        'February 2016',
        'The calendar is centered in the `center`, no on the `selected` date',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2016-02-29"]')
      .exists(
        'The days in the calendar actually belong to the displayed month',
      );
    assert
      .dom('.ember-power-calendar-day--selected')
      .exists('There is one day marked as selected');
    assert
      .dom('.ember-power-calendar-day--selected')
      .hasAttribute(
        'data-date',
        '2016-03-05',
        'The passed `selected` is the selected day',
      );
  });

  test("The days that belong to the currently displayed month have a distintive class that the days belonging to the previous/next month don't", async function (assert) {
    assert.expect(4);
    await render(hbs`
      <PowerCalendar as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-01"]')
      .hasClass(
        'ember-power-calendar-day--current-month',
        'Days of the current month have this class',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-31"]')
      .hasClass(
        'ember-power-calendar-day--current-month',
        'Days of the current month have this class',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-09-30"]')
      .hasNoClass(
        'ember-power-calendar-day--current-month',
        "Days of the previous month don't",
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-11-01"]')
      .hasNoClass(
        'ember-power-calendar-day--current-month',
        "Days of the previous month don't",
      );
  });

  test("The current day has a special class that other days don't", async function (assert) {
    assert.expect(3);
    await render(hbs`
      <PowerCalendar as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-18"]')
      .hasClass(
        'ember-power-calendar-day--today',
        'The current day has a special class',
      );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-19"]')
      .hasNoClass('ember-power-calendar-day--today');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-17"]')
      .hasNoClass('ember-power-calendar-day--today');
  });

  test('If there is no `onSelect` action, days are disabled', async function (assert) {
    assert.expect(1);
    await render(hbs`
      <PowerCalendar as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);

    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-18"]')
      .hasAttribute('disabled');
  });

  test('If there is an `onSelect` action, days can be focused', async function (assert) {
    assert.expect(1);
    this.foo = () => {};
    await render(hbs`
      <PowerCalendar @onSelect={{this.foo}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    let dayElement = this.element.querySelector(
      '.ember-power-calendar-day[data-date="2013-10-18"]',
    );
    await focus(dayElement);
    assert.strictEqual(document.activeElement, dayElement);
  });

  test('If a day is focused, it gets a special hasClass', async function (assert) {
    assert.expect(3);
    this.foo = () => {};
    await render(hbs`
      <PowerCalendar @onSelect={{this.foo}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    let dayElement = this.element.querySelector(
      '.ember-power-calendar-day[data-date="2013-10-18"]',
    );
    await focus(dayElement);
    assert
      .dom(dayElement)
      .hasClass(
        'ember-power-calendar-day--focused',
        'The focused day gets a special class',
      );
    let anotherDayElement = this.element.querySelector(
      '.ember-power-calendar-day[data-date="2013-10-21"]',
    );
    await focus(anotherDayElement);
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

  test('Clicking one day, triggers the `onSelect` action with that day (which is a object with some basic information)', async function (assert) {
    assert.expect(3);
    this.didChange = function (day, calendar, e) {
      assert.isDay(day, 'The first argument is a day object');
      assert.isCalendar(
        calendar,
        "The second argument is the calendar's public API",
      );
      assert.ok(e instanceof Event, 'The third argument is an event');
    };
    await render(hbs`
      <PowerCalendar @onSelect={{this.didChange}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    await click('.ember-power-calendar-day[data-date="2013-10-18"]');
  });

  test('If the `onSelect` updates the selected value, it can work as a date-selector', async function (assert) {
    assert.expect(2);
    this.selected = new Date(2016, 1, 5);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render(hbs`
      <PowerCalendar @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);

    assert
      .dom('.ember-power-calendar-day--selected')
      .hasAttribute('data-date', '2016-02-05');
    await click('.ember-power-calendar-day[data-date="2016-02-21"]');
    assert
      .dom('.ember-power-calendar-day--selected')
      .hasAttribute('data-date', '2016-02-21');
  });

  test('If a day is focused, using left/right arrow keys focuses the previous/next day', async function (assert) {
    assert.expect(6);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render(hbs`
      <PowerCalendar @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);

    await focus('.ember-power-calendar-day[data-date="2013-10-18"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-18"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ),
    );

    await triggerKeyEvent(
      '.ember-power-calendar-day[data-date="2013-10-18"]',
      'keydown',
      37,
    ); // left arrow
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-17"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-17"]',
      ),
    );

    await triggerKeyEvent(
      '.ember-power-calendar-day[data-date="2013-10-17"]',
      'keydown',
      39,
    ); // right arrow
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-18"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ),
    );
  });

  test('If a day is focused, using up/down arrow keys focuses the same weekday of the previous/next week', async function (assert) {
    assert.expect(6);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render(hbs`
      <PowerCalendar @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);
    await focus('.ember-power-calendar-day[data-date="2013-10-18"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-18"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ),
    );

    await triggerKeyEvent(
      '.ember-power-calendar-day[data-date="2013-10-18"]',
      'keydown',
      38,
    ); // left arrow
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-11"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-11"]',
      ),
    );

    await triggerKeyEvent(
      '.ember-power-calendar-day[data-date="2013-10-17"]',
      'keydown',
      40,
    ); // right arrow
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-18"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ),
    );
  });

  test('If the `@onCenterChange` action returns a `thenable`, the component enter loading state while that thenable resolves or rejects', async function (assert) {
    assert.expect(2);
    let done = assert.async();
    this.asyncAction = function () {
      return new RSVP.Promise(function (resolve) {
        later(resolve, 200);
      });
    };
    await render(hbs`
      <PowerCalendar @onCenterChange={{this.asyncAction}} as |calendar|>
        <div class={{if calendar.loading 'is-loading-yo'}}></div>
        <calendar.Nav/>
        <calendar.Days/>
      </PowerCalendar>
    `);

    setTimeout(function () {
      assert
        .dom('.is-loading-yo')
        .exists('The component is in a loading state');
    }, 100);

    await click('.ember-power-calendar-nav-control--next');

    setTimeout(function () {
      assert
        .dom('.is-loading-yo')
        .doesNotExist('The component is not in a loading state anymore');
      done();
    }, 250);
  });

  test('If the calendar without `onSelect` receives a block on the `days` component, that block is used to render each one of the days of the cell', async function (assert) {
    assert.expect(1);
    await render(hbs`
      <PowerCalendar as |calendar|>
        <calendar.Days as |day|>
          {{day.number}}!
        </calendar.Days>
      </PowerCalendar>
    `);
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-01"]')
      .hasText('1!', 'The block has been rendered');
  });

  test('If the calendar with `onSelect` receives a block on the `days` component, that block is used to render each one of the days of the cell', async function (assert) {
    assert.expect(1);
    this.onSelect = (selected) => {
      this.set('day', selected.date);
    };
    await render(hbs`
      <PowerCalendar @selected={{this.day}} @onSelect={{this.selected}} as |calendar|>
        <calendar.Days as |day|>
          {{day.number}}!
        </calendar.Days>
      </PowerCalendar>
    `);
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-01"]')
      .hasText('1!', 'The block has been rendered');
  });

  test('If the user passes `minDate=someDate` to single calendars, days before that one cannot be selected, but that day and those after can', async function (assert) {
    assert.expect(6);
    this.minDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render(hbs`
      <PowerCalendar @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days @minDate={{this.minDate}}/>
      </PowerCalendar>
    `);

    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-14"]')
      .isDisabled('Days before the minDate are disabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .isNotDisabled('The minDate is selectable');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-16"]')
      .isNotDisabled('Days after the minDate are selectable');

    run(() => this.set('minDate', new Date(2013, 9, 18)));
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-14"]')
      .isDisabled('Days before the minDate are disabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-17"]')
      .isDisabled('The minDate is selectable');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-18"]')
      .isNotDisabled('Days after the minDate are selectable');
  });

  test('If the user passes `@maxDate={{someDate}}` to single calendars, days after that one cannot be selected, but that day and those days before can', async function (assert) {
    assert.expect(6);
    this.maxDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render(hbs`
      <PowerCalendar @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days @maxDate={{this.maxDate}}/>
      </PowerCalendar>
    `);

    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-14"]')
      .isNotDisabled('Days before the maxDate are selectable');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .isNotDisabled('The maxDate is selectable');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-16"]')
      .isDisabled('Days after the maxDate are disabled');

    run(() => this.set('maxDate', new Date(2013, 9, 18)));
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-17"]')
      .isNotDisabled('Days before the maxDate are selectable');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-18"]')
      .isNotDisabled('The maxDate is selectable');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-19"]')
      .isDisabled('Days after the maxDate are disabled');
  });

  test('If the user passes `minDate=someDate` to range calendars, days before that one cannot be selected, but that day and those after can', async function (assert) {
    assert.expect(3);
    this.minDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days @minDate={{this.minDate}}/>
      </PowerCalendarRange>
    `);

    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-14"]')
      .isDisabled('Days before the minDate are disabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .isNotDisabled('The minDate is selectable');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-16"]')
      .isNotDisabled('Days after the minDate are selectable');
  });

  test('If the user passes `maxDate=someDate` to range calendars, days after that one cannot be selected, but that day and those days before can', async function (assert) {
    assert.expect(3);
    this.maxDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days @maxDate={{this.maxDate}}/>
      </PowerCalendarRange>
    `);

    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-14"]')
      .isNotDisabled('Days before the maxDate are selectable');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .isNotDisabled('The maxDate is selectable');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-16"]')
      .isDisabled('Days after the maxDate are disabled');
  });

  test('If the user passes `disabledDates=someDate` to single calendars, days on those days are disabled', async function (assert) {
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
    await render(hbs`
      <PowerCalendar @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days @disabledDates={{this.disabledDates}}/>
      </PowerCalendar>
    `);

    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-14"]')
      .isNotDisabled('The 14th is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .isDisabled('The 15th is disabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-14"]')
      .isNotDisabled('The 16th is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-17"]')
      .isDisabled('The 17th is disabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-21"]')
      .isDisabled('The 21st is disabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-23"]')
      .isDisabled('The 23rd is disabled');

    run(() => this.set('disabledDates', [new Date(2013, 9, 22)]));
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-14"]')
      .isNotDisabled('The 14th is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .isNotDisabled('The 15th is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-14"]')
      .isNotDisabled('The 16th is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-17"]')
      .isNotDisabled('The 17th is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-21"]')
      .isNotDisabled('The 21st is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-23"]')
      .isNotDisabled('The 23rd is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-23"]')
      .isNotDisabled('The 22nd is disabled');

    run(() =>
      this.set('disabledDates', [new Date(2013, 9, 22), 'Tue', 'Thu', 'Sun']),
    );
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-14"]')
      .isNotDisabled('The 14th is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .isDisabled('The 15th is disabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-14"]')
      .isNotDisabled('The 16th is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-17"]')
      .isDisabled('The 17th is disabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-21"]')
      .isNotDisabled('The 21st is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-23"]')
      .isNotDisabled('The 23rd is enabled');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-23"]')
      .isNotDisabled('The 22nd is disabled');
  });

  test('When the user tries to focus a disabled date with the left arrow key, the focus stays where it is', async function (assert) {
    assert.expect(4);
    this.minDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days @minDate={{this.minDate}}/>
      </PowerCalendarRange>
    `);

    await focus('.ember-power-calendar-day[data-date="2013-10-15"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ),
    );

    await triggerKeyEvent(
      '.ember-power-calendar-day[data-date="2013-10-15"]',
      'keydown',
      37,
    ); // left arrow
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ),
    );
  });

  test('When the user tries to focus a disabled date with the up arrow key, the focus goes to the latest selectable day', async function (assert) {
    assert.expect(4);
    this.minDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days @minDate={{this.minDate}}/>
      </PowerCalendarRange>
    `);

    await focus('.ember-power-calendar-day[data-date="2013-10-18"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-18"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-18"]',
      ),
    );

    await triggerKeyEvent(
      '.ember-power-calendar-day[data-date="2013-10-18"]',
      'keydown',
      38,
    ); // up arrow
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ),
    );
  });

  test('When the user tries to focus a disabled date with the right arrow key, the focus stays where it is', async function (assert) {
    assert.expect(4);
    this.maxDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days @maxDate={{this.maxDate}}/>
      </PowerCalendarRange>
    `);

    await focus('.ember-power-calendar-day[data-date="2013-10-15"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ),
    );

    await triggerKeyEvent(
      '.ember-power-calendar-day[data-date="2013-10-15"]',
      'keydown',
      39,
    ); // right arrow
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ),
    );
  });

  test('When the user tries to focus a disabled date with the down arrow key, the focus goes to the latest selectable day', async function (assert) {
    assert.expect(4);
    this.maxDate = new Date(2013, 9, 15);
    this.onSelect = (selected) => {
      this.set('selected', selected.date);
    };
    await render(hbs`
      <PowerCalendarRange @selected={{this.selected}} @onSelect={{this.onSelect}} as |calendar|>
        <calendar.Nav/>
        <calendar.Days @maxDate={{this.maxDate}}/>
      </PowerCalendarRange>
    `);

    await focus('.ember-power-calendar-day[data-date="2013-10-11"]');
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-11"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-11"]',
      ),
    );

    await triggerKeyEvent(
      '.ember-power-calendar-day[data-date="2013-10-11"]',
      'keydown',
      40,
    ); // down arrow
    assert
      .dom('.ember-power-calendar-day[data-date="2013-10-15"]')
      .hasClass('ember-power-calendar-day--focused');
    assert.strictEqual(
      document.activeElement,
      this.element.querySelector(
        '.ember-power-calendar-day[data-date="2013-10-15"]',
      ),
    );
  });

  test('user can provide `@tag` attribute', async function (assert) {
    assert.expect(1);
    await render(hbs`
      <PowerCalendar @tag="li" />
    `);
    assert
      .dom('li.ember-power-calendar')
      .exists('default `div` overwritten with `li`');
  });

  test('user can provide empty `@tag` attribute', async function (assert) {
    assert.expect(1);
    await render(hbs`
      <PowerCalendar @tag="" />
    `);
    assert
      .dom('.ember-power-calendar')
      .doesNotExist('default `div` overwritten');
  });
});
