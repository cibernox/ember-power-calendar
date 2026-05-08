import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import setupInspector from '@embroider/legacy-inspector-support/ember-source-4.12';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import { registerDateLibrary } from 'ember-power-calendar';
import DateUtils from 'ember-power-calendar-moment';
import compatModules from '@embroider/virtual/compat-modules';
// @ts-expect-error Cannot find module or type declarations for side-effect import of 'moment/dist/locale/es'.
import 'moment/dist/locale/es';
// @ts-expect-error Cannot find module or type declarations for side-effect import of 'moment/dist/locale/ru'.
import 'moment/dist/locale/ru';
// @ts-expect-error Cannot find module or type declarations for side-effect import of 'moment/dist/locale/fr'.
import 'moment/dist/locale/fr';
// @ts-expect-error Cannot find module or type declarations for side-effect import of 'moment/dist/locale/pt'.
import 'moment/dist/locale/pt';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

registerDateLibrary(DateUtils);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
  inspector = setupInspector(this);
}

loadInitializers(App, config.modulePrefix, compatModules);
