import CodeExample from 'docs/components/code-example';
import MultipleMonths1 from '../../../components/snippets/multiple-months-1';
import MultipleMonths2 from '../../../components/snippets/multiple-months-2';
import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Display Multiple Months</h1>

  <p>
    You might want to display multiple months simultaneously. Displaying multiple
    months is a nice especially when you might want people to select dates across
    month boundaries.
  </p>

  <p>
    We are in luck! Versions of Ember Power Calendar greater than 0.11.0 can
    support this with a few little twix.
  </p>

  <CodeExample
    @glimmerTs="multiple-months-1.gts"
    @css="multiple-months-1-css.scss"
  >
    {{MultipleMonths1}}
  </CodeExample>

  <p>
    How? Well. In versions of ember-power-calendar greater than 0.11.0 we can pass
    a
    <code>center</code>
    property to the
    <code>calendar.Days</code>
    component. This center property must be a valid date. As long as you use the
    <code>ember-power-calendar-range</code>
    component, months will render with the correct center and everything still
    works! If you want the months to be changeable you will need to wire that up
    yourself similar to how we demonstate above. You might need to bust out some
    fancy styling, but we are web developers... are we not?
  </p>

  <p>
    Another nice pattern for mobile is to render all 12 months vertically and let
    the user scroll them.
  </p>

  <CodeExample
    @glimmerTs="multiple-months-2.gts"
    @css="multiple-months-2-css.css"
  >
    {{MultipleMonths2}}
  </CodeExample>

  <p>
    In this example, we create an array of all the month centers and loop over
    them. A little dash of CSS to align them correct. Easy peasy lemon-squeezy.
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.cookbook.nav-select"
      class="doc-page-nav-link-prev"
    >&lt; Nav with select</LinkTo>
  </div>
</template>
