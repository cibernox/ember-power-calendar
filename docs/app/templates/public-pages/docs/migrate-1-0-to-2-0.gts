import { LinkTo } from '@ember/routing';

<template>
  <h1 class="doc-page-title">Migrate from 1.0 to 2.0</h1>

  <h2>Breaking changes</h2>

  <ul>
    <li>
      The minimum required versions are:
      <ul>
        <li>Ember 4.12 and above</li>
        <li><code>ember-basic-dropdown</code> 9.x and above</li>
        <li><code>ember-truth-helpers</code> 5.x and above</li>
        <li><code>@ember/test-helpers</code> 5.x and above</li>
        <li><code>@glimmer/component</code> 2.x and above</li>
        <li><code>ember-concurrency</code> 5.x and above</li>
      </ul>
    </li>
    <li>
      <p>
        Passing
        <code>components</code>
        as strings is no longer supported. You must now pass all components as
        <code>contextual components</code>.<br />
        <small><i>(Ember deprecated passing components as strings in version
            3.25. In line with this change, we have removed the dependency on
            the deprecated
            <code>@embroider/util</code>
            package.)</i></small>
      </p>
    </li>
    <li>
      <p>
        Some typescript issues were fixed, which are possible breaking, when
        components were customized.
      </p>
    </li>
    <li>
      <p>
        The
        <code>@tag</code>
        parameter can no longer be passed as empty string (Necessary to fix
        typing issues).
      </p>
    </li>
    <li>
      SCSS changes:
      <ul>
        <li>
          <p>
            <code>node-sass</code>
            has been deprecated for many years and is no longer supported.
            Please migrate to
            <code>sass</code>
            or
            <code>sass-embedded</code>.
          </p>
        </li>
        <li>
          <p>
            Our SCSS files have been migrated to the modern API. Please update
            their usage in your app. See the
            <LinkTo
              @route="public-pages.docs.installation"
            >Installation</LinkTo>
            section for details.
          </p>
        </li>
      </ul>
    </li>
  </ul>

  <div class="doc-page-nav">
    <LinkTo
      @route="public-pages.docs.the-days"
      class="doc-page-nav-link-prev"
    >&lt; The days</LinkTo>
    <LinkTo
      @route="public-pages.docs.test-helpers"
      class="doc-page-nav-link-next"
    >Test helpers &gt;</LinkTo>
  </div>
</template>
