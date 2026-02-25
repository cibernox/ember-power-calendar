import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import { formatDate } from 'ember-power-calendar/utils';

<template>
  <PowerCalendar class="demo-calendar-small" as |calendar|>
    <calendar.Nav>
      {{formatDate calendar.center "MMM YY"}}
    </calendar.Nav>

    <calendar.Days />
  </PowerCalendar>
</template>
