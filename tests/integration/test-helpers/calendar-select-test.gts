import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, type TestContext } from '@ember/test-helpers';
import { calendarSelect } from '#src/test-support/helpers.ts';
import PowerCalendar from '#src/components/power-calendar.gts';
import type {
  PowerCalendarAPI,
  TPowerCalendarOnSelect,
} from '#src/components/power-calendar.gts';
import type { NormalizeCalendarValue } from '#src/utils.ts';
import HostWrapper from '../../../demo-app/components/host-wrapper.gts';
import { getRootNode } from '../../helpers';

interface Context extends TestContext {
  element: HTMLElement;
  center4: Date;
  selected4: Date;
  onSelect: TPowerCalendarOnSelect;
  onCenterChange: (
    newCenter: NormalizeCalendarValue,
    calendar: PowerCalendarAPI,
    event: Event,
  ) => Promise<void> | void;
}

module('Test Support | Helper | calendarSelect', function (hooks) {
  setupRenderingTest(hooks);

  test<Context>('`calendarSelect` selects the given date ', async function (assert) {
    const self = this;

    this.center4 = new Date(2013, 9, 18);
    this.selected4 = new Date(2013, 9, 15);
    this.onCenterChange = (selected) => {
      this.set('center4', selected.date);
    };
    this.onSelect = (selected) => {
      this.set('selected4', selected.date);
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <div class="calendar-select-1">
            <PowerCalendar
              @center={{self.center4}}
              @selected={{self.selected4}}
              @onSelect={{self.onSelect}}
              @onCenterChange={{self.onCenterChange}}
              as |calendar|
            >
              <calendar.Nav />
              <calendar.Days />
            </PowerCalendar>
          </div>
        </HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.calendar-select-1 .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('October 2013');
    assert
      .dom(
        '.calendar-select-1 [data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--selected', 'The 15th is selected');
    await calendarSelect(
      '.calendar-select-1',
      new Date(2013, 9, 11),
      getRootNode(this.element),
    );

    assert
      .dom(
        '.calendar-select-1 [data-date="2013-10-11"]',
        getRootNode(this.element),
      )
      .hasClass(
        'ember-power-calendar-day--selected',
        'The 11th of October is selected',
      );
  });

  test<Context>('`calendarSelect` selects the given date changing the month center on the process', async function (assert) {
    const self = this;

    this.center4 = new Date(2013, 9, 18);
    this.selected4 = new Date(2013, 9, 15);
    this.onCenterChange = (selected) => {
      this.set('center4', selected.date);
    };
    this.onSelect = (selected) => {
      this.set('selected4', selected.date);
    };
    await render<Context>(
      <template>
        <HostWrapper>
          <div class="calendar-select-1">
            <PowerCalendar
              @center={{self.center4}}
              @selected={{self.selected4}}
              @onSelect={{self.onSelect}}
              @onCenterChange={{self.onCenterChange}}
              as |calendar|
            >
              <calendar.Nav />
              <calendar.Days />
            </PowerCalendar>
          </div>
        </HostWrapper>
      </template>,
    );

    assert
      .dom(
        '.calendar-select-1 .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('October 2013');
    assert
      .dom(
        '.calendar-select-1 [data-date="2013-10-15"]',
        getRootNode(this.element),
      )
      .hasClass('ember-power-calendar-day--selected', 'The 15th is selected');
    await calendarSelect(
      '.calendar-select-1',
      new Date(2013, 8, 3),
      getRootNode(this.element),
    );

    assert
      .dom(
        '.calendar-select-1 .ember-power-calendar-nav-title',
        getRootNode(this.element),
      )
      .hasText('September 2013', 'The nav component has updated');
    assert
      .dom(
        '.calendar-select-1 [data-date="2013-09-01"]',
        getRootNode(this.element),
      )
      .exists('The days component has updated');
    assert
      .dom(
        '.calendar-select-1 [data-date="2013-09-03"]',
        getRootNode(this.element),
      )
      .hasClass(
        'ember-power-calendar-day--selected',
        'The 3rd of september is selected',
      );
  });
});
