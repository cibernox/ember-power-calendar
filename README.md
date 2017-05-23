# Ember Power Calendar [![Build Status](https://travis-ci.org/cibernox/ember-power-calendar.svg?branch=master)](https://travis-ci.org/cibernox/ember-power-calendar)

Customizable Calendar Component for Ember.

## Disclayment

This addon is in very early days of development, so things might change fast over
the next weeks. Use it with caution!

## Installation

`ember install ember-power-calendar`

## Usage

There is many possible ways to use it, for giving you just a taste of the API:

```hbs
{{#power-calendar selected=arrival onSelect=(action (mut arrival) value="moment") as |calendar|}}
  {{calendar.nav}}
  {{calendar.days}}
{{/power-calendar}}
```

Check the full documentation in www.ember-power-calendar.com
