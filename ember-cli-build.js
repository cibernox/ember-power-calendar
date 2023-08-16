'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const app = new EmberAddon(defaults, {
    snippetPaths: ['tests/dummy/app/components/snippets'],
    'ember-cli-babel': {
      includePolyfill: true,
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  const webpack = require('webpack');

  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packagerOptions: {
      webpackConfig: {
        plugins: [
          new webpack.IgnorePlugin({
            // workaround for https://github.com/embroider-build/ember-auto-import/issues/578
            resourceRegExp: /moment/,
          }),
        ],
      },
    },
  });
};
