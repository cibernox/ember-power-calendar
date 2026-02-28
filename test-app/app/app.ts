import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import { registerDateLibrary } from 'ember-power-calendar';
import DateUtils from 'ember-power-calendar-moment';
import 'moment/dist/locale/es';
import 'moment/dist/locale/ru';
import 'moment/dist/locale/fr';
import 'moment/dist/locale/pt';

import compatModules from '@embroider/virtual/compat-modules';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

registerDateLibrary(DateUtils);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
}

loadInitializers(App, config.modulePrefix, compatModules);
