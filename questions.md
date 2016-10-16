#### If the component takes a `date` property, should it track changed on it?

Example:

```hbs
  {{calendar date=date}}
```


#### If the user changes click on the month selector on the calendar, should the calendar propagate changes up on the date property?

Absolutely not. This component is extrictly one-way.

#### Should the user be notified of month/changes?

I suppose so. Seems like something people would want to observe. By example, to fetch events for the new month as user changes months.

#### Should the month change pass though the user in order to work?

Unsure. A bit verbose, but seems reasonable. Example syntax:

```hbs
{{power-calendar date=date onMonthChange=(action (mut date))}}
```

However, the `date` term seems a bit ambiguous. Perhaps it should be `displayedMonth` or `currentMonth` or `selectedMonth`?

Making this explicit one-way mutation optional opens room for one questions:

#### What if the one-way is omitted and the user changes the `date` (or `displayedMonth`) property. Should the calendar change the month?

If the user didn't change the month, yes, but...

#### what if the user changed the month and the `date` property gets updated from the outside? Which one prevails?

Unsure, but I feel inclined to obey state changes coming from the outside. However, this state diversions due to non unidirectional data-flow
makes me uneasy. Perhaps the I should favour explicitness and enforce user-handling. A posibility could be to NOT show the arrows to change
month unless a `onMonthChange` action to handle it is provided.

#### About naming: What should I use. `onMonthChange` or `onmonthchange`.

I need to consider possible implications in Glimmer components. Ask core team.

#### By default, if no `date` is provided but a `selectedDate` is, the caledar dutifully centers it in that month. Should changes on
that `selectedDate` property update the displayed month? Should this behaviour NOT BE AUTOMATIC?

If this behaviour is not automatic it means that the api would be
```hbs
{{power-calendar date=wedding selectedDate=wedding}}
```

This per se it's not that bad, but if you want to have month navigation you need this:

```hbs
{{power-calendar date=wedding selectedDate=wedding onMonthChange=(action (mut wedding))}}
```

This changes the selected date, so now we need another property, and an OR:

```hbs
{{power-calendar date=(or selectedMonth wedding) selectedDate=wedding onMonthChange=(action (mut selectedMonth))}}
```

This starts to feel a bit too much for just a calendar with month navigation.