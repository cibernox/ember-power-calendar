# Ember Power Calendar [![Build Status](https://travis-ci.org/cibernox/ember-power-calendar.svg?branch=master)](https://travis-ci.org/cibernox/ember-power-calendar)

Customizable Calendar Component for Ember.

## Disclaimer

Version 0.14 of this addon requires Ember 3.11 or greater.
Versions below 0.14 would work with Ember 3.0+ (and perhaps 2.12+)

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
<PowerCalendar @selected={{arrival}} @onSelect={{action (mut arrival) value="date"}} as |calendar|>
  <calendar.Nav/>
  <calendar.Days/>
</PowerCalendar>
```

Check the full documentation at www.ember-power-calendar.com

