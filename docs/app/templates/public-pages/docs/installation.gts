import { LinkTo } from '@ember/routing';
import CodeExample from 'docs/components/code-example';

<template>
  <h1 class="doc-page-title">Installation &amp; setup</h1>

  <p>
    To install
    <code>ember-power-calendar</code>, run the following command in your Ember
    project directory:
  </p>

  <p>
    <div class="code-block">
      <pre>$ pnpm install ember-power-calendar</pre>
    </div>
  </p>

  <p>But this is not enough to put the calendar to work.</p>

  <h3>Choose your preferred date library</h3>

  <p>
    Date manipulation is
    <em>hard</em>. Date internationalization is even harder. That's why this
    component needs help from a third party date library to display and
    manipulate dates.
  </p>

  <p>
    You can choose one of the following date libraries to make Ember Power
    Calendar work:
  </p>

  <ul>
    <li><a href="https://github.com/cibernox/ember-power-calendar-luxon">Ember
        Power Calendar Luxon</a></li>
    <li><a href="https://github.com/cibernox/ember-power-calendar-moment">Ember
        Power Calendar Moment</a></li>
    <li><a
        href="https://github.com/ember-power-addons/ember-power-calendar-date-fns"
      >Ember Power Calendar date-fns</a></li>
  </ul>

  <p>
    If you like, you can also create your own adapter for any other date
    library. Just check how one of the above packages has implemented the
    required API.
  </p>

  <p>
    <strong>Note:</strong>
    Although the calendars should behave the same regardless of the option you
    choose, there might be subtle differences in how dates are displayed, as
    Moment.js bundles its own translations while Luxon uses the
    <a
      href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat"
    >Intl.DateTimeFormat</a>
    native API to localize dates into the user's language (that also means Luxon
    is a lighter library).
  </p>

  <p>
    After you have installed you need to register the date library to
    <code>ember-power-calendar</code>. For
    <code>ember-power-calendar-moment</code>
    you need to add this lines in
    <code>app.js/ts</code>.
    <CodeExample @js="installation.ts" @showResult={{false}} @activeTab="js" />

    If you are using any other date library please check the ReadMe of the
    package.
  </p>

  <h3>Add the styles</h3>

  <p>
    If you use vanilla CSS, you need to add the following line into
    <code>app.js</code>
    or in any route/controller/component
    <code>.js/.ts</code>
    file:
  </p>

  <CodeExample
    @js="installation-2.ts.txt"
    @showResult={{false}}
    @activeTab="js"
  />

  <p>
    Instead of adding the styling in an
    <code>.js</code>
    file and depending from your build config you can also add the css in any
    template/component css file by using following line
  </p>

  <CodeExample
    @css="installation-3.css.txt"
    @showResult={{false}}
    @activeTab="css"
  />

  <p>
    However, if you are using SASS you need to add an import statement to your
    styles.
  </p>

  <CodeExample
    @scss="installation-1.scss"
    @showResult={{false}}
    @activeTab="scss"
  />

  <p>
    Doing that will bring in all of the styles except those related to the size
    of the calendar. For defining the size of the calendar there is a mixin that
    takes the size of the cell you want your calendar to be. By example:
  </p>

  <CodeExample
    @scss="installation-2.scss"
    @showResult={{false}}
    @activeTab="scss"
  />

  <br />

  <p>
    The
    <code>ember-power-calendar</code>
    mixin also allows a great amount of customization regarding the coloring of
    the calendar.
  </p>
  <CodeExample
    @scss="installation-2a.scss"
    @showResult={{false}}
    @activeTab="scss"
  />

  <br />

  <p>
    For those using Less, the process is very similar. Import the addon styles
    with:
  </p>
  <CodeExample
    @scss="installation-3.less"
    @showResult={{false}}
    @activeTab="scss"
  />
  <br />

  <p>
    The mixin provided can be used like so:
  </p>
  <CodeExample
    @scss="installation-4.less"
    @showResult={{false}}
    @activeTab="scss"
  />
  <br />

  <p>
    This code above will make each one of those classes have a different size.
  </p>

  <h3>Install ember-concurrency (required peerDependency)</h3>

  <p>
    The addon is using internal ember-concurrency. For installation see
    <a
      href="http://ember-concurrency.com/docs/installation"
      target="_blank"
      rel="noopener noreferrer"
    >ember-concurrency</a>
    installation page.
  </p>

  <div class="doc-page-nav">
    <LinkTo @route="public-pages.docs.index" class="doc-page-nav-link-prev">&lt;
      Overview</LinkTo>
    <LinkTo
      @route="public-pages.docs.how-to-use-it"
      class="doc-page-nav-link-next"
    >How to use it &gt;</LinkTo>
  </div>
</template>
