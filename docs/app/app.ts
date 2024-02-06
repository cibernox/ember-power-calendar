import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'docs/config/environment';
import { registerDateLibrary } from 'ember-power-calendar';
// @ts-expect-error Could not find a declaration file for module
import DateUtils from 'ember-power-calendar-moment';

registerDateLibrary(DateUtils);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
