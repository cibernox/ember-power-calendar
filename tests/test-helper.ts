import EmberApp from 'ember-strict-application-resolver';
import EmberRouter from '@ember/routing/router';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import isCalendar from './assertions/is-calendar';
import isDay from './assertions/is-day';
import { initialize } from '../demo-app/global-locale';
import PowerCalendarService from '#src/services/power-calendar.ts';
import DateUtils from 'ember-power-calendar-moment';
import { registerDateLibrary } from '#src/utils.ts';
import { setConfig, type Config } from 'ember-basic-dropdown/config';
import { setTesting } from '@embroider/macros';
import 'moment/dist/locale/es';
import 'moment/dist/locale/ru';
import 'moment/dist/locale/fr';
import 'moment/dist/locale/pt';

class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

class TestApp extends EmberApp {
  modules = {
    './router': Router,
    './services/power-calendar': PowerCalendarService,
    // add any custom services here
    // import.meta.glob('./services/*', { eager: true }),
  };
}

Router.map(function () {});

export function start() {
  setTesting(true);
  registerDateLibrary(DateUtils);
  initialize();
  setApplication(
    TestApp.create({
      autoboot: false,
      rootElement: '#ember-testing',
    }),
  );

  // @ts-expect-error Property 'isCalendar' does not exist on type 'Assert'
  QUnit.assert.isCalendar = isCalendar;
  // @ts-expect-error Property 'isDay' does not exist on type 'Assert'
  QUnit.assert.isDay = isDay;

  setup(QUnit.assert);
  setupEmberOnerrorValidation();

  setConfig(defaultBasicDropdownConfig);

  qunitStart();
}

export const defaultBasicDropdownConfig: Config = {
  rootElement:
    import.meta.env.VITE_SHADOW_DOM_BUILD === 'true'
      ? '#ember-basic-dropdown-wormhole'
      : '#ember-testing',
};
