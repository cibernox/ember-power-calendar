import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import { formatDate } from 'ember-power-calendar/utils';
import { eq, or } from 'ember-truth-helpers';

<template>
  <PowerCalendar as |calendar|>
    <calendar.Nav />

    <calendar.Days as |day|>
      {{#let (formatDate day.date "ddd") as |weekday|}}
        {{#if (or (eq weekday "Sat") (eq weekday "Sun"))}}
          <strong class="pink-text">{{day.number}}</strong>
        {{else}}
          {{day.number}}
        {{/if}}
      {{/let}}
    </calendar.Days>
  </PowerCalendar>
</template>
