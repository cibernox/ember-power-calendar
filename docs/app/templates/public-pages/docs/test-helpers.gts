import { LinkTo } from '@ember/routing';
import CodeExample from 'docs/components/code-example';

<template>
  <h1 class="doc-page-title">Test helpers</h1>

  <br />
  <h2>Acceptance Tests</h2>

  <p>
    Ember Power Calendar provides two acceptance helpers (<code
    >calendarCenter</code>
    and
    <code>calendarSelect</code>) that make it nicer to interact with the
    component during tests.
  </p>

  <h3><code>calendarCenter(cssSelector, date)</code></h3>

  <p>
    This async helper allows you to move the center (change the month) of the
    calendar in the given selector without interacting with the nav.
  </p>

  <CodeExample
    @js="test-helpers-2-js.js"
    @showResult={{false}}
    @activeTab="js"
  />

  <p>If the calendar does not have an
    <code>onCenterChange</code>
    action it will throw a helpful error message.</p>

  <h3><code>calendarSelect(cssSelector, date)</code></h3>

  <p>
    Use this helper to select a day of the calendar like if you clicked on it.
    If to do so the calendar has to display a different month, it will do that
    automatically.
  </p>

  <CodeExample
    @js="test-helpers-3-js.js"
    @showResult={{false}}
    @activeTab="js"
  />

  <p>
    If you are dealing with a multiple or range calendar you can just call it
    more than once.
  </p>

  <h2>Integration Tests</h2>

  <p>
    Just import the helpers like
    <code>import { calendarCenter, calendarSelect } from
      'ember-power-calendar/test-support/helpers';</code>
    and use them as any other helper 😀
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.migrate-1-0-to-2-0"
      class="doc-page-nav-link-prev"
    >&lt; Migrate from 1.0 to 2.0</LinkTo>
    <LinkTo
      @route="public-pages.docs.api-reference"
      class="doc-page-nav-link-next"
    >Api reference &gt;</LinkTo>
  </div>
</template>
