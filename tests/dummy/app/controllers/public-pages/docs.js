import Controller from '@ember/controller';
import { computed, action } from '@ember/object';
import { inject as service } from '@ember/service';

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
    groupName: 'Other',
    options: [
      { route: 'public-pages.docs.test-helpers', text: 'Test helpers' },
      { route: 'public-pages.docs.api-reference', text: 'API reference' },
    ],
  },
];

export default class extends Controller {
  @service router;
  groupedSections = groupedSections;

  @computed('router.currentRouteName')
  get currentSection() {
    let currentRouteName = this.router.currentRouteName;
    for (let i = 0; i < groupedSections.length; i++) {
      let group = groupedSections[i];
      for (let j = 0; j < group.options.length; j++) {
        let section = group.options[j];
        if (section.route === currentRouteName) {
          return section;
        }
      }
    }
    return undefined;
  }

  @action
  visit(section) {
    this.router.transitionTo(section.route);
  }
}
