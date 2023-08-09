import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class extends Component {
  @service('power-calendar') calendarService;
  locales = ['en', 'es', 'ru', 'fr', 'pt'];

  // Actions
  @action
  changeAppWideLocale(locale) {
    this.calendarService.set('locale', locale);
  }
}
