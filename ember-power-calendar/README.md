[![NPM](https://badge.fury.io/js/ember-power-calendar.svg)](https://www.npmjs.com/package/ember-power-calendar)
[![Ember Observer Score](https://emberobserver.com/badges/ember-power-calendar.svg)](https://emberobserver.com/addons/ember-power-calendar)
![Ember Version](https://img.shields.io/badge/ember-%3E%3D4.12-brightgreen?logo=emberdotjs&logoColor=white)
[![Discord](https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord)](https://discord.com/channels/480462759797063690/486202731766349824)
[![Build Status](https://github.com/cibernox/ember-power-calendar/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/cibernox/ember-power-calendar)

# ember-power-calendar

Customizable Calendar Component for Ember.

### Features

- 🖊 **TypeScript support** – ships with type definitions for smooth TypeScript integration.
- ✨ **Glint support** – template type-checking out of the box for safer templates.
- 🚀 **FastBoot compatible** – works in server-rendered Ember apps.
- 🛠 **Addon v2 ready** – modern Ember Addon v2 format.
- 🧱 **Headless & flexible** – build any calendar or date-picker UI without being constrained by markup or styles.
- 🎯 **Powerful selection modes** – choose between single, range, or multiple date selection
- 🔧 **Flexible calendar API** – plug in your preferred date library (e.g., momentjs, date-fns, Luxon)
- 🧩 **Composable** – assemble calendars using yielded subcomponents like days and navigation.
- ♿ **Accessible by default** – full keyboard navigation, ARIA attributes, and focus management built-in.
- 🎨 **Fully customizable rendering** – control how days, headers, and disabled states are displayed.

### Compatibility

- Embroider or ember-auto-import v2
- Ember.js v4.12 or above

### Installation

`pnpm install ember-power-calendar`

### Usage

There are many possible ways to use it, for giving you just a taste of the API:

```glimmer-ts
import PowerCalendar from "ember-power-calendar/components/power-calendar";

<PowerCalendar @selected={{this.arrival}} @onSelect={{this.onChange}} as |calendar|>
  <calendar.Nav/>
  <calendar.Days/>
</PowerCalendar>
```

Check the full documentation at www.ember-power-calendar.com

