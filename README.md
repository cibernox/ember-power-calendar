# Ember Power Calendar [![Build Status](https://travis-ci.org/cibernox/ember-power-calendar.svg?branch=master)](https://travis-ci.org/cibernox/ember-power-calendar)

Customizable Calendar Component for Ember.

## Disclaimer

This addon is in very early days of development, so things might change fast over
the next weeks. Use it with caution!

## Installation

`ember install ember-power-calendar`

Internet Explorer 11 support requires babel polyfill:

```js
// ember-cli-build.js

let app = new EmberAddon(defaults, {
  'ember-cli-babel': {
    includePolyfill: true
  }
});
```

## Usage

There are many possible ways to use it, for giving you just a taste of the API:

```hbs
{{#power-calendar selected=arrival onSelect=(action (mut arrival) value="date") as |calendar|}}
  {{calendar.nav}}
  {{calendar.days}}
{{/power-calendar}}
```

Check the full documentation at www.ember-power-calendar.com

