### Example syntax for ranges

```hbs
{{!-- Two values and two actions. Each one updated independently --}}
{{power-calendar
  start=start
  end=end
  onStartChange=(action (mut start) value="date")
  onEndChange=(action (mut start) value="date")}}

{{!-- O --}}
{{!-- selected is { start: moment(), end: moment() }  or { start: Date, end: Date } --}}
{{!--

One value and one action. The value is anything that has `start` and `end` keys,
but the value passed by the `onSelect` action is a convenient Range object, that
lookis like this:
{
  date: { start: Date, end: Date }, // POJO like the entry object, with dates
  moment: { start: moment(), date: moment }, // POJO like the entry object, with moments
  isMultiMonth: true, // extra data, not sure which one yet
  isOpen: Boolean,    // Probably unneeded since checking if it has an end is enough
  contains: function(date) {
    // Some convenience options
    return Boolean
  }
}

The `onSelect` action is fired every time either end of the range changes.
--}}

{{power-calendar
  selected=selected
  onSelect=(action (mut selected) value="date")}}

```

### Example syntax for sparse sets

```hbs
{{!-- Selected is an array of Dates --}}
{{!--
  The value received by the onSelect action is an object with two keys, `date` and `moment`,
  one containing an array of dates and the other containing an array of moments
--}}
{{power-calendar
  selected=selected
  onSelect=(action (mut selected) value="date")}}
```


### EXAMPLE OF CONTEXTUAL COMPONENTS API

<!-- Just days -->
{{#power-calendar as |calendar|}}
  {{calendar.days}}
{{/power-calendar}}

<!-- Days and nav -->
{{#power-calendar as |calendar|}}
  {{calendar.nav}}
  {{calendar.days}}
{{/power-calendar}}


<!-- Days and nav -->
{{#power-calendar center=month selected=day onSelect=(action (mut day) value="date") onCenterChange=(action (mut month) value="date") as |calendar|}}
  {{calendar.nav}}

  {{#calendar.days as |day|}}
    {{day.number}}
  {{/calendar.days}}
{{/power-calendar}}
