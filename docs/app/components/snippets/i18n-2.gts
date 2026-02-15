import PowerCalendar from 'ember-power-calendar/components/power-calendar';

<template>
  <PowerCalendar @locale="ru" as |calendar|>
    <calendar.Nav />
    <calendar.Days />
  </PowerCalendar>
</template>
