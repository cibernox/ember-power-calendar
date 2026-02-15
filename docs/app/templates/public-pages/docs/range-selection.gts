import CodeExample from 'docs/components/code-example';
import RangeSelection1 from '../../../components/snippets/range-selection-1';
import RangeSelection2 from '../../../components/snippets/range-selection-2';
import RangeSelection3 from '../../../components/snippets/range-selection-3';
import RangeSelection4 from '../../../components/snippets/range-selection-4';
import RangeSelection5 from '../../../components/snippets/range-selection-5';
import RangeSelection6 from '../../../components/snippets/range-selection-6';
import RangeSelection7 from '../../../components/snippets/range-selection-7';
import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Range selection</h1>

  <p>
    The most common use case of calendars is selecting a single day. The second
    most common one is selecting a duration, aka, a range.
  </p>

  <p>
    The only differences in the API between a calendar for selecting a single day
    and a calendar for selecting a range are that the name of the component is now
    <code>power-calendar-range</code>
    and that the
    <code>selected</code>
    option has to implement the
    <code>Range</code>
    interface. It might sound scary, but it only means that it has to be an object
    with
    <code>start</code>
    and
    <code>end</code>
    properties.
  </p>

  <p>
    The same
    <code>onSelect</code>
    action used in the previous chapter to select one date, is now used to select
    a range. The object that this action receives has a
    <code>date</code>
    and either
    <code>moment</code>
    or
    <code>datetime</code>
    properties, each one containing a range with the dates in native Date objects
    or in momentJS/Luxon.DateTime objects.
  </p>

  <p>
    Lets see this in action.
  </p>

  <CodeExample @glimmerTs="range-selection-1.gts">
    {{RangeSelection1}}
  </CodeExample>

  <p>
    All the days in the range are selected, and the ends of the range have some
    special classes so you can style them differently.
  </p>

  <p>
    Let's see an example:
  </p>

  <CodeExample @glimmerTs="range-selection-2.gts">
    {{RangeSelection2}}
  </CodeExample>

  <p>Hey, I never said I was a brilliant designer! But you get the idea.</p>

  <h3>The <code>minRange</code> and <code>maxRange</code> option</h3>

  <p>
    Usually the only restriction in ranges is that they have to start in one day
    and end in a different day, but sometimes you want to be more restrictive on
    the length of the range, so the
    <code>minRange</code>
    and
    <code>maxRange</code>
    cover this they way you expect them to.
  </p>

  <p>
    Those options accept a
    <code>number</code>
    and a
    <code>string</code>. If you are using Moment, it can also take a
    <code>moment.Duration</code>
    object, and if you are using Luxon a
    <code>Luxon.Duration</code>
    one. The default minimum range is one day, so the range has to start in a
    different date from where it begins and there is no maximum range.
  </p>

  <p>If you want to force the user to pick a range of at least 3 days you can just
    pass a number:</p>

  <CodeExample @glimmerTs="range-selection-3.gts">
    {{RangeSelection3}}
  </CodeExample>

  <p>
    Notice that once you select one end of the range the days that cannot be
    selected are disabled automatically.
  </p>

  <p>
    This property accepts humanized durations which makes it very nice to use with
    different units other than days. Let's make the range be of at most one week.
  </p>

  <CodeExample @glimmerTs="range-selection-4.gts">
    {{RangeSelection4}}
  </CodeExample>

  <p>
    As you'd expect, you can also use the abbreviations accepted by
    <code>MomentJs</code>
    and combine
    <code>minRange</code>
    and
    <code>maxRange</code>
    as you want.
  </p>

  <CodeExample @glimmerTs="range-selection-5.gts">
    {{RangeSelection5}}
  </CodeExample>

  <p>
    If you want to allow ranges to begin and end on the same day, pass
    <code>minRange=0</code>.
  </p>

  <CodeExample @glimmerTs="range-selection-6.gts">
    {{RangeSelection6}}
  </CodeExample>

  <h3>The <code>proximitySelection</code> option</h3>
  <p>
    This option changes the behaviour of date selection after a choosing a start
    and an end date. The default behaviour on the third click will select a new
    start date of a brand new range. With this flag enabled, once you have a
    range, clicking a third time will move the closest of the extremes, narrowing
    or extending the range.
  </p>

  <CodeExample @glimmerTs="range-selection-7.gts">
    {{RangeSelection7}}
  </CodeExample>

  <p>
    Now let's see how to select several non-consecutive dates.
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.action-handling"
      class="doc-page-nav-link-prev"
    >&lt; Action handling</LinkTo>
    <LinkTo
      @route="public-pages.docs.multiple-selection"
      class="doc-page-nav-link-next"
    >Multiple selection &gt;</LinkTo>
  </div>
</template>
