'use strict';

const pending = [
  {
    "moduleId": "addon/templates/components/power-calendar/days",
    "only": [
      "no-invalid-interactive"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/helpers-testing",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages",
    "only": [
      "no-curly-component-invocation",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/components/days-grid-without-mon-or-wed",
    "only": [
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/cookbook",
    "only": [
      "no-action",
      "no-curly-component-invocation",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/docs",
    "only": [
      "no-action",
      "no-curly-component-invocation",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/index",
    "only": [
      "no-curly-component-invocation",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/support-the-project",
    "only": [
      "no-inline-styles",
      "require-valid-alt-text"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/action-handling-1",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/action-handling-2",
    "only": [
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/action-handling-3",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/datepicker-1",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/how-to-use-it-2",
    "only": [
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/how-to-use-it-3",
    "only": [
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/how-to-use-it-4",
    "only": [
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/how-to-use-it-5",
    "only": [
      "no-curly-component-invocation",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/i18n-1",
    "only": [
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/multiple-months-1",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/multiple-months-2",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/multiple-selection-1",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/multiple-selection-2",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/multiple-selection-3",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/multiple-selection-4",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/nav-select-1",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/nav-select-2",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/nav-select-3",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/range-selection-1",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/range-selection-2",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/range-selection-3",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/range-selection-4",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/range-selection-5",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/range-selection-6",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/range-selection-7",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/the-days-0",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/the-days-2",
    "only": [
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/the-days-4",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/the-days-5",
    "only": [
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/the-days-6",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/the-days-7",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/the-days-8",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/the-nav-2",
    "only": [
      "no-action",
      "no-implicit-this"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/snippets/the-nav-3",
    "only": [
      "no-action"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/cookbook/datepicker",
    "only": [
      "no-partial",
      "no-curly-component-invocation"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/cookbook/index",
    "only": [
      "no-curly-component-invocation"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/cookbook/multiple-months",
    "only": [
      "no-partial",
      "no-curly-component-invocation"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/cookbook/nav-select",
    "only": [
      "no-partial",
      "no-curly-component-invocation"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/docs/action-handling",
    "only": [
      "no-partial",
      "no-curly-component-invocation"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/docs/how-to-use-it",
    "only": [
      "no-partial",
      "no-curly-component-invocation"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/docs/i18n",
    "only": [
      "no-partial",
      "no-curly-component-invocation"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/docs/installation",
    "only": [
      "no-curly-component-invocation"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/docs/multiple-selection",
    "only": [
      "no-obsolete-elements",
      "no-partial",
      "no-curly-component-invocation"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/docs/range-selection",
    "only": [
      "no-partial",
      "no-curly-component-invocation"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/docs/test-helpers",
    "only": [
      "no-curly-component-invocation"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/docs/the-days",
    "only": [
      "no-partial",
      "no-curly-component-invocation"
    ]
  },
  {
    "moduleId": "tests/dummy/app/templates/public-pages/docs/the-nav",
    "only": [
      "no-partial",
      "no-curly-component-invocation"
    ]
  }
];

module.exports = {
  extends: 'octane',
  rules: {
    'no-unused-block-params': false
  },
  pending,
};
