import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'docs/config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import { registerDateLibrary } from 'ember-power-calendar';
import DateUtils from 'ember-power-calendar-moment';
import Prism from 'prismjs';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-handlebars';
import 'prismjs/components/prism-markup-templating';
// @ts-expect-error no types shipped from prismjs-glimmer
import { setup } from 'prismjs-glimmer';

import 'prismjs/themes/prism.css';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
setup(Prism);

registerDateLibrary(DateUtils);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
