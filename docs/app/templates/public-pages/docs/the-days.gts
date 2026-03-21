import CodeExample from 'docs/components/code-example';
import TheDays0 from '../../../components/snippets/the-days-0';
import TheDays1 from '../../../components/snippets/the-days-1';
import TheDays2 from '../../../components/snippets/the-days-2';
import TheDays3 from '../../../components/snippets/the-days-3';
import TheDays4 from '../../../components/snippets/the-days-4';
import TheDays5 from '../../../components/snippets/the-days-5';
import TheDays6 from '../../../components/snippets/the-days-6';
import TheDays7 from '../../../components/snippets/the-days-7';
import TheDays8 from '../../../components/snippets/the-days-8';
import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">The days</h1>

  <p>
    A calendar is basically a list of days, typically (although not necessarily)
    displayed in a grid with 7 columns. So the first thing you might want to
    customize is the content of each day.
  </p>

  <h3>Pass a custom class for each day</h3>

  <p>
    You can pass to this component a
    <code>dayClass</code>
    argument. If this argument is a string, that string will be added as a class
    to every rendered day.
  </p>

  <p>
    This on itself is not amazing, but if instead of a string
    <code>dayClass</code>
    is a function, it will be invoked for every day, receiving the day object
    and the calendar. You can then implement any custom logic to add classes to
    buttons.
  </p>

  <p>
    Using this technique we can create complex things, like a calendar with
    multiple selection in which the selected days have a
    <em>"magnetic"</em>
    border.
  </p>

  <CodeExample @glimmerTs="the-days-0.gts">
    {{TheDays0}}
  </CodeExample>

  <h3>Passing a block</h3>

  <p>
    There are many ways of doing it, but the simplest one is passing a block
    that will be the content of each cell of the grid. It's not the most
    versatile, but it can be used for simple customizations.
  </p>

  <p>
    The block receives two arguments. The first one is a useful day object and
    the second is the public API of the component. You can check the API of both
    objects
    <a href="/docs/api-reference">API reference</a>
    section.
  </p>

  <p>
    Let's start by making the number of the days of the weeked be strong and
    pink, because we like weekends.
  </p>

  <CodeExample @glimmerTs="the-days-1.gts">
    {{TheDays1}}
  </CodeExample>

  <p>
    The properties of they so called "day" object to make most common
    customizations easy.
  </p>

  <h3>Just using the public API</h3>

  <p>
    Like with
    <LinkTo @route="public-pages.docs.the-nav">The nav</LinkTo>
    component, all the behaviour is implemented using the public API of the
    calendar, so you can build your calendar and replace it.
  </p>

  <p>
    This is a non-trivial example where I build a weird month grid that has no
    Mondays or Wednesdays. Yay short weeks!
  </p>

  <CodeExample @glimmerTs="the-days-2.gts">
    {{TheDays2}}
  </CodeExample>

  <h3>Passing a custom component</h3>

  <p>
    Just like with the nav component, you can encapsulate this weird grid with 5
    days week into a component to reuse it all over the place. Maybe if you use
    it often enough the boss end up thinking weeks have 3 working days.
  </p>

  <CodeExample @glimmerTs="the-days-3.gts">
    {{TheDays3}}
  </CodeExample>

  <p>
    This options is the one that gives you more power, but it would be silly to
    make users create their own components for very common changes like
    customizing the start of the week and things like that, so the default
    <code>calendar.Days</code>
    component has a few configuration options to tweak for the most common use
    cases.
  </p>

  <h3><code>startOfWeek</code></h3>

  <p>
    By default, weeks will start on the appropriate day of the week based on the
    locale configured in the
    <code>service:power-calendar</code>
    (which defaults to the global locale configured in MomentJS if you are using
    it). There is a built in option to tweak the locale's default, pass
    <code>startOfWeek=[NUMBER]</code>
    to change the first day of the week. Values go from
    <code>0</code>
    (Sunday) to
    <code>6</code>
    (Saturday).
  </p>

  <CodeExample @glimmerTs="the-days-4.gts">
    {{TheDays4}}
  </CodeExample>

  <h3><code>showDaysAround</code></h3>

  <p>
    By default the calendar displays the days of the surrounding months in the
    first and last week but if you want to hide them pass
    <code>showDaysAround=false</code>.
  </p>

  <CodeExample @glimmerTs="the-days-5.gts">
    {{TheDays5}}
  </CodeExample>

  <h3><code>minDate</code> and <code>maxDate</code></h3>

  <p>
    If you want to prevent some days before a particular date from being
    selected, pass
    <code>minDate=someDate</code>
    and/or
    <code>maxDate=someOtherDate</code>. Dates before/after those values can be
    selected (those dates included), but the rest of the days cannot be selected
    or focused.
  </p>

  <p>By example, in the next example, only days between 11th and 21th can be
    selected (both inclusive)</p>

  <CodeExample @glimmerTs="the-days-6.gts">
    {{TheDays6}}
  </CodeExample>

  <h3><code>disabledDates</code></h3>

  <p>
    Sometimes you don't want to disabled dates before or after some marks but
    some specific list of dates, like holidays or birthdays. The
    <code>disabledDates</code>
    is what you want. Pass a collection of Date or Moment objects and those days
    will be disabled.
  </p>

  <CodeExample @glimmerTs="the-days-7.gts">
    {{TheDays7}}
  </CodeExample>

  <h3><code>weekdayFormat</code></h3>

  <p>
    By default the name of the days of the week is in its abbreviated form, but
    you can use the
    <code>weekdayFormat</code>
    to change it. The accepted values are
    <code>short</code>
    (the default),
    <code>long</code>
    (the full day name) and
    <code>min</code>
    (an even shorter abbreviation).
  </p>

  <CodeExample @glimmerTs="the-days-8.gts">
    {{TheDays8}}
  </CodeExample>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.the-nav"
      class="doc-page-nav-link-prev"
    >&lt; The nav</LinkTo>
    <LinkTo
      @route="public-pages.docs.migrate-1-0-to-2-0"
      class="doc-page-nav-link-next"
    >Migrate from 1.0 to 2.0 &gt;</LinkTo>
  </div>
</template>
