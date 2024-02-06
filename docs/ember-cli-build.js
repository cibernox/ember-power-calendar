'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    'ember-cli-babel': { enableTypeScriptTransform: true },
    snippetPaths: ['app/components/snippets'],
    autoImport: {
      watchDependencies: ['ember-power-calendar'],
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};
