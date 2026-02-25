import Component from '@glimmer/component';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import PowerSelect from 'ember-power-select/components/power-select';
import type RouterService from '@ember/routing/router-service';

const groupedSections = [
  {
    groupName: 'Basic recipes',
    options: [
      { route: 'public-pages.cookbook.index', text: 'Datepicker' },
      { route: 'public-pages.cookbook.nav-select', text: 'Nav with select' },
      {
        route: 'public-pages.cookbook.multiple-months',
        text: 'Multiple months',
      },
      // { route: 'public-pages.cookbook.material-theme',        text: 'Material theme' },
      // { route: 'public-pages.cookbook.css-animations',        text: 'CSS animations' },
      // { route: 'public-pages.cookbook.debounce-searches',     text: 'Debounce searches' },
      // { route: 'public-pages.cookbook.create-custom-options', text: 'Create custom options' }
    ],
  },
  // {
  //   groupName: 'Advanced recipes',
  //   options: [
  //     { route: 'public-pages.cookbook.navigable-select', text: 'Navigable select' }
  //   ]
  // }
];

export default class extends Component {
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
  visit(section: { route: string; text: string }) {
    this.router.transitionTo(section.route);
  }

  <template>
    <section class="docs">
      <nav class="side-nav">
        <header class="side-nav-header">Basic recipes</header>
        <LinkTo
          @route="public-pages.cookbook.index"
          class="side-nav-link"
        >Datepicker</LinkTo>
        <LinkTo
          @route="public-pages.cookbook.nav-select"
          class="side-nav-link"
        >Nav with select</LinkTo>
        <LinkTo
          @route="public-pages.cookbook.multiple-months"
          class="side-nav-link"
        >Multiple months</LinkTo>
        {{!
        <LinkTo @route='public-pages.cookbook.material-theme' class="side-nav-link">Material theme</LinkTo>
        <LinkTo @route='public-pages.cookbook.css-animations' class="side-nav-link">CSS Animations</LinkTo>
        <LinkTo @route='public-pages.cookbook.debounce-searches' class="side-nav-link">Debounce searches</LinkTo>
        <LinkTo @route='public-pages.cookbook.create-custom-options' class="side-nav-link">Create custom options</LinkTo>
        <header class="side-nav-header">Advanced recipies</header>
        <LinkTo @route='public-pages.cookbook.navigable-select' class="side-nav-link">Navigable select</LinkTo>
        }}
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
