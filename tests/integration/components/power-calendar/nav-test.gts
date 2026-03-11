import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, type TestContext } from '@ember/test-helpers';
import Nav from '#src/components/power-calendar/nav.gts';
import type PowerCalendarService from '#src/services/power-calendar.ts';
import type {
  PowerCalendarAPI,
  TPowerCalendarMoveCenterUnit,
} from '#src/components/power-calendar.gts';

let calendarService: PowerCalendarService;
let calendar: PowerCalendarAPI;

interface Context extends TestContext {
  element: HTMLElement;
  // center: Date | undefined;
  calendar: PowerCalendarAPI;
  // startOfWeek: string | undefined;
  // weekdayFormat: TWeekdayFormat;
  // classFn: TDayClass<PowerCalendarAPI>;
  // selected: Date | undefined;
  // minDate: Date | undefined;
  // maxDate: Date | undefined;
  // disabledDates: (string | Date)[] | undefined;
  // onCenterChange: (newCenter: NormalizeCalendarValue, calendar: PowerCalendarAPI, event: Event) => Promise<void> | void;
  // moveCenter?: (newCenter: NormalizeCalendarValue, calendar: PowerCalendarAPI, event: Event) => Promise<void> | void;
  // onSelect?: TPowerCalendarOnSelect;
}

module('Integration | Component | <PowerCalendar::Nav>', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    calendarService = this.owner.lookup(
      'service:power-calendar',
    ) as PowerCalendarService;
    calendarService.set('date', new Date(2013, 9, 18));
    calendar = {
      uniqueId: 'test-calendar',
      loading: false,
      type: 'single',
      center: calendarService.getDate(),
      locale: 'en',
      actions: {
        moveCenter: async () => {},
        select: () => {},
      },
    };
  });

  test<Context>('[i18n] If the user sets a different locale in the calendar, this setting overrides the locale set in the calendar service', async function (assert) {
    const self = this;

    assert.expect(2);
    this.calendar = calendar;
    await render<Context>(
      <template><Nav @calendar={{self.calendar}} /></template>,
    );
    assert.dom('.ember-power-calendar-nav-title').hasText('October 2013');
    this.set('calendar.locale', 'es');
    assert.dom('.ember-power-calendar-nav-title').hasText('octubre 2013');
  });

  test<Context>('it can changes the date format', async function (assert) {
    const self = this;

    assert.expect(1);
    this.calendar = calendar;
    await render<Context>(
      <template><Nav @calendar={{self.calendar}} @format="YYYY" /></template>,
    );
    assert.dom('.ember-power-calendar-nav-title').hasText('2013');
  });

  test<Context>('it uses unit=month by default', async function (assert) {
    const self = this;

    assert.expect(1);
    this.calendar = calendar;
    const moved: { step: number; unit: TPowerCalendarMoveCenterUnit }[] = [];
    this.calendar.actions.moveCenter = async (step, unit) => {
      moved.push({ step, unit });
      await Promise.resolve();
    };
    await render<Context>(
      <template><Nav @calendar={{self.calendar}} /></template>,
    );
    await click('.ember-power-calendar-nav-control--previous');
    await click('.ember-power-calendar-nav-control--next');

    assert.deepEqual(
      [
        { step: -1, unit: 'month' },
        { step: 1, unit: 'month' },
      ],
      moved,
    );
  });

  test<Context>('it can changes the unit', async function (assert) {
    const self = this;

    assert.expect(1);
    this.calendar = calendar;
    const moved: { step: number; unit: TPowerCalendarMoveCenterUnit }[] = [];
    this.calendar.actions.moveCenter = async (step, unit) => {
      moved.push({ step, unit });
      await Promise.resolve();
    };
    await render<Context>(
      <template><Nav @calendar={{self.calendar}} @unit="year" /></template>,
    );
    await click('.ember-power-calendar-nav-control--previous');
    await click('.ember-power-calendar-nav-control--next');

    assert.deepEqual(
      [
        { step: -1, unit: 'year' },
        { step: 1, unit: 'year' },
      ],
      moved,
    );
  });
});
