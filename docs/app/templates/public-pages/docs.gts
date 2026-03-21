import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { LinkTo } from '@ember/routing';
import PowerSelect from 'ember-power-select/components/power-select';
import type RouterService from '@ember/routing/router-service';

const groupedSections = [
  {
    groupName: 'Getting started',
    options: [
      { route: 'public-pages.docs.index', text: 'Overview' },
      { route: 'public-pages.docs.installation', text: 'Installation & setup' },
      { route: 'public-pages.docs.how-to-use-it', text: 'How to use it' },
      { route: 'public-pages.docs.action-handling', text: 'Action handling' },
      { route: 'public-pages.docs.range-selection', text: 'Range selection' },
      {
        route: 'public-pages.docs.multiple-selection',
        text: 'Multiple selection',
      },
    ],
  },
  {
    groupName: 'Basic customization',
    options: [
      { route: 'public-pages.docs.i18n', text: 'I18n' },
      { route: 'public-pages.docs.the-nav', text: 'The nav' },
      { route: 'public-pages.docs.the-days', text: 'The list' },
    ],
  },
  {
    groupName: 'Migrate',
    options: [
      {
        route: 'public-pages.docs.migrate-1-0-to-2-0',
        text: 'Migrate from 1.0 to 2.0',
      },
    ],
  },
  {
    groupName: 'Other',
    options: [
      { route: 'public-pages.docs.test-helpers', text: 'Test helpers' },
      { route: 'public-pages.docs.api-reference', text: 'API reference' },
    ],
  },
];

export default class PublicPagesDocs extends Component {
  @service declare router: RouterService;

  groupedSections = groupedSections;

  get currentSection() {
    const currentRouteName = this.router.currentRouteName;
    for (let i = 0; i < groupedSections.length; i++) {
      const group = groupedSections[i];
      if (group) {
        for (let j = 0; j < group.options.length; j++) {
          const section = group.options[j];
          if (section && section.route === currentRouteName) {
            return section;
          }
        }
      }
    }

    return undefined;
  }

  @action
  visit(section: { route: string; text: string } | undefined) {
    this.router.transitionTo(section?.route);
  }

  <template>
    {{! template-lint-disable no-duplicate-landmark-elements }}
    <section class="docs">
      <nav class="side-nav">
        <header class="side-nav-header">Getting started</header>
        <LinkTo
          @route="public-pages.docs.index"
          class="side-nav-link"
        >Overview</LinkTo>
        <LinkTo
          @route="public-pages.docs.installation"
          class="side-nav-link"
        >Installation &amp; setup</LinkTo>
        <LinkTo
          @route="public-pages.docs.how-to-use-it"
          class="side-nav-link"
        >How to use it</LinkTo>
        <LinkTo
          @route="public-pages.docs.action-handling"
          class="side-nav-link"
        >Action handling</LinkTo>
        <LinkTo
          @route="public-pages.docs.range-selection"
          class="side-nav-link"
        >Range selection</LinkTo>
        <LinkTo
          @route="public-pages.docs.multiple-selection"
          class="side-nav-link"
        >Multiple selection</LinkTo>
        <header class="side-nav-header">Basic customization</header>
        <LinkTo
          @route="public-pages.docs.i18n"
          class="side-nav-link"
        >I18n</LinkTo>
        <LinkTo @route="public-pages.docs.the-nav" class="side-nav-link">The nav</LinkTo>
        <LinkTo @route="public-pages.docs.the-days" class="side-nav-link">The
          days</LinkTo>
        <header class="side-nav-header">Upgrade</header>
        <LinkTo
          @route="public-pages.docs.migrate-1-0-to-2-0"
          class="side-nav-link"
        >Migrate from 1.0 to 2.0</LinkTo>
        <header class="side-nav-header">Other</header>
        <LinkTo
          @route="public-pages.docs.test-helpers"
          class="side-nav-link"
        >Test helpers</LinkTo>
        <LinkTo
          @route="public-pages.docs.api-reference"
          class="side-nav-link"
        >API reference</LinkTo>
      </nav>
      <section class="doc-page">
        <PowerSelect
          @selected={{this.currentSection}}
          @options={{this.groupedSections}}
          @onChange={{this.visit}}
          @searchField="text"
          @triggerClass="section-selector"
          as |option|
        >
          {{option.text}}
        </PowerSelect>
        {{outlet}}
      </section>
    </section>
  </template>
}
