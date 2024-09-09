# Ember Power Calendar

[![CI](https://github.com/cibernox/ember-power-calendar/actions/workflows/ci.yml/badge.svg)](https://github.com/cibernox/ember-power-calendar/actions/workflows/ci.yml)
[![Ember Observer Score](http://emberobserver.com/badges/ember-power-calendar.svg)](http://emberobserver.com/addons/ember-power-calendar)
[![npm version](https://badge.fury.io/js/ember-power-calendar.svg)](https://badge.fury.io/js/ember-power-calendar)

Customizable Calendar Component for Ember.

## Compatibility

* Ember.js v3.28 or above
* Ember CLI v3.28 or above

## Installation

`ember install ember-power-calendar`


## Usage

There are many possible ways to use it, for giving you just a taste of the API:

```hbs
<PowerCalendar @selected={{this.arrival}} @onSelect={{this.onChange}} as |calendar|>
  <calendar.Nav/>
  <calendar.Days/>
</PowerCalendar>
```

Check the full documentation at www.ember-power-calendar.com

