import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class extends Controller {
  @service ('power-calendar') calendarService
  locales = ['en', 'es', 'ru', 'fr', 'pt' ]

  // Actions
  @action
  changeAppWideLocale(locale) {
    this.calendarService.set('locale', locale);
  }
}
