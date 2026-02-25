import CodeExample from 'docs/components/code-example';
import I18n1 from '../../../components/snippets/i18n-1';
import I18n2 from '../../../components/snippets/i18n-2';
import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">I18n</h1>

  <p>
    Ember Power Calendar uses exposes a power-calendar service that has a locale
    property and uses that locale to format dates. If you want to change the
    locale for all your calendars, set the
    <code>locale</code>
    property on that service and every calendar will update.
  </p>

  <p>
    When the locale is updated not only the language changes but also the first
    day of the week and any other configuration.
  </p>

  <CodeExample @glimmerTs="i18n-1.gts">
    {{I18n1}}
  </CodeExample>

  <p>
    Also, you can override the global locale on a per-instance basis passing
    <code>locale="some-locale"</code>. The next calendar is going to be in
    russian no matter what the global locale is.
  </p>

  <CodeExample @glimmerTs="i18n-2.gts">
    {{I18n2}}
  </CodeExample>

  <p>
    In the next sections you are going to see how to customize the
    sub-components of the calendar.
  </p>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.multiple-selection"
      class="doc-page-nav-link-prev"
    >&lt; Multiple selection</LinkTo>
    <LinkTo
      @route="public-pages.docs.the-nav"
      class="doc-page-nav-link-next"
    >The nav &gt;</LinkTo>
  </div>
</template>
