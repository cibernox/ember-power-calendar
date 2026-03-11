import EmberApp from 'ember-strict-application-resolver';
import EmberRouter from '@ember/routing/router';
import PageTitleService from 'ember-page-title/services/page-title';
import { registerDateLibrary } from '#src/index.ts';
import DateUtils from 'ember-power-calendar-moment';
import { initialize } from './global-locale';
import PowerCalendarService from '#src/services/power-calendar.ts';
import 'moment/dist/locale/es';
import 'moment/dist/locale/ru';
import 'moment/dist/locale/fr';
import 'moment/dist/locale/pt';

initialize();
registerDateLibrary(DateUtils);

class Router extends EmberRouter {
  location = 'history';
  rootURL = '/';
}

export class App extends EmberApp {
  /**
   * Any services or anything from the addon that needs to be in the app-tree registry
   * will need to be manually specified here.
   *
   * Techniques to avoid needing this:
   * - private services
   * - require the consuming app import and configure themselves
   *   (which is what we're emulating here)
   */
  modules = {
    './router': Router,
    './services/page-title': PageTitleService,
    './services/power-calendar': PowerCalendarService,
    /**
     * NOTE: this glob will import everything matching the glob,
     *     and includes non-services in the services directory.
     */
    ...import.meta.glob('./services/**/*', { eager: true }),
    /**
     * These imports are not magic, but we do require that all entries in the
     * modules object match a ./[type]/[name] pattern.
     *
     * See: https://rfcs.emberjs.com/id/1132-default-strict-resolver
     */
    ...import.meta.glob('./templates/**/*', { eager: true }),

    ...import.meta.glob('./components/**/*', { eager: true }),
  };
}

Router.map(function () {
  this.route('helpers-testing');
});
