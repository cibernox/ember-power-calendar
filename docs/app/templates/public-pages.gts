import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { add, formatDate } from 'ember-power-calendar/utils';
import { dropTask, timeout, waitForQueue } from 'ember-concurrency';
import type RouterService from '@ember/routing/router-service';
import { LinkTo } from '@ember/routing';
import { on } from '@ember/modifier';
import { eq } from 'ember-truth-helpers';

export default class PublicPages extends Component {
  @service declare router: RouterService;

  now = new Date();

  @tracked day = this.now;

  today = this.now;

  flipPage = dropTask(async (e: MouseEvent) => {
    if (this.router.currentRouteName === 'public-pages.docs.index') {
      return;
    }

    const pageElement = (e.target as HTMLElement).closest<HTMLElement>('.header-calendar-page');
    if (!pageElement) {
      return;
    }

    const clone = pageElement.cloneNode(true);
    const parent = pageElement.parentNode;

    if (!parent) {
      return;
    }

    parent.insertBefore(clone, pageElement);
    this.day = add(this.day, 1, 'day');

    await waitForQueue('afterRender');

    // pageElement.offsetLeft; // force layout
    pageElement.classList.add('run-animation');

    await timeout(400);

    pageElement.classList.remove('run-animation');
    parent.removeChild(clone);
  });

  <template>
    <header class="main-header">
      <nav class="main-header-nav">
        <div class="main-header-nav-links">
          <LinkTo
            @route="public-pages.docs"
            class="main-header-nav-link"
          >Docs</LinkTo>
          <LinkTo
            @route="public-pages.cookbook"
            class="main-header-nav-link"
          >Cookbook</LinkTo>
          <LinkTo
            @route="public-pages.addons"
            class="main-header-nav-link"
          >Addons</LinkTo>
          <a
            href="https://github.com/cibernox/ember-power-calendar"
            class="main-header-nav-link"
          >Github</a>
        </div>
        <div class="main-header-logo">
          <LinkTo @route="public-pages.index" class="home-link">
            <img src="/ember_logo.png" alt="ember" />
            <strong>Power</strong>
            {{! template-lint-disable no-invalid-interactive }}
            <div class="header-calendar" {{on "click" this.flipPage.perform}}>
              <div
                class="header-calendar-page
                  {{if (eq this.day this.today) '' 'run-animation'}}"
              >
                <sub class="calendar-page-number">{{formatDate this.day "D"}}</sub>
                Calendar
              </div>
              <div class="header-calendar-ring left"></div>
              <div class="header-calendar-ring right"></div>
            </div>
          </LinkTo>
        </div>
      </nav>
    </header>
    <div class="main-content">
      {{outlet}}
    </div>
    <footer class="main-footer">
      <div class="main-footer-content">
        Deployed with love by
        <a href="http://github.com/cibernox">Miguel Camba</a>
      </div>
    </footer>

    {{!-- <RememberDocumentScroll @key={{this.router.currentRouteName}} /> --}}
  </template>
}
