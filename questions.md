### Example syntax for ranges

```hbs
{{!-- Two values and two actions. Each one updated independently --}}
{{power-calendar
  start=start
  end=end
  onStartChange=(action (mut start) value="moment")
  onEndChange=(action (mut start) value="moment")}}

{{!-- O --}}
{{!-- selected is { start: moment(), end: moment() }  or { start: Date, end: Date } --}}
{{!--

One value and one action. The value is anything that has `start` and `end` keys,
but the value passed by the `onChange` action is a convenient Range object, that
lookis like this:
{
  date: { start: Date, end: Date }, // POJO like the entry object, with dates
  moment: { start: moment(), date: moment }, // POJO like the entry object, with moments
  isMultiMonth: true, // extra data, not sure which one yet
  isOpen: Boolean,    // Probably unneeded since checking if it has an end is enough
  contains: function(dateOrMoment) {
    // Some convenience options
    return Boolean
  }
}

The `onChange` action is fired every time either end of the range changes.
--}}

{{power-calendar
  selected=selected
  onChange=(action (mut selected) value="moment")}}

```

### Example syntax for sparse sets

```hbs
{{!-- Selected is an array of Dates or moments --}}
{{!--
  The value received by the onChange action is an object with two keys, `date` and `moment` (maybe `dates` and `moments`),
  one containing an array of dates and the other containing an array of moments
--}}
{{power-calendar
  selected=selected
  onChange=(action (mut selected) value="moment")}}
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
{{#power-calendar displayedMonth=month selected=day onChange=(action (mut day) value="moment") onMonthChange=(action (mut month) value="moment") as |calendar|}}
  {{calendar.nav}}

  {{#calendar.days as |day|}}
    {{day.number}}
  {{/calendar.days}}
{{/power-calendar}}
