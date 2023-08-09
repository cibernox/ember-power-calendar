### Example syntax for ranges

```hbs
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

<PowerCalendar
  @selected={{this.selected}}
  @onSelect={{this.onSelect}} />

```

### Example syntax for sparse sets

```hbs
{{!-- Selected is an array of Dates --}}
{{!--
  The value received by the onSelect action is an object with two keys, `date` and `moment`,
  one containing an array of dates and the other containing an array of moments
--}}
<PowerCalendar
  @selected={{this.selected}}
  @onSelect={{this.onSelect)}} />
```


### EXAMPLE OF CONTEXTUAL COMPONENTS API

<!-- Just days -->
<PowerCalendar as |calendar|>
  <calendar.Days/>
</PowerCalendar>

<!-- Days and nav -->
<PowerCalendar as |calendar|>
  <calendar.Nav/>
  <calendar.Days/>
</PowerCalendar>


<!-- Days and nav -->
<PowerCalendar @center={{this.month}} @selected={{this.day}} @onSelect={{this.onSelect}} @onCenterChange={{this.onCenterChange}} as |calendar|>
  <calendar.Nav/>

  <calendar.Days as |day|>
    {{day.number}}
  </calendar.Days>
</PowerCalendar>
