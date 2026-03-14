import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import PowerSelect from 'ember-power-select/components/power-select';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import type PowerCalendarService from 'ember-power-calendar/services/power-calendar';

export default class extends Component {
  @service declare powerCalendar: PowerCalendarService;

  locales: string[] = ['en', 'es', 'ru', 'fr', 'pt'];

  // Actions
  @action
  changeAppWideLocale(locale: string | undefined) {
    this.powerCalendar.locale = locale ?? 'en';
  }

  <template>
    <PowerSelect
      @triggerClass="i18n-select-demo"
      @options={{this.locales}}
      @selected={{this.powerCalendar.locale}}
      @onChange={{this.changeAppWideLocale}}
      as |locale|
    >
      {{locale}}
    </PowerSelect>
    <br />
    <PowerCalendar as |calendar|>
      <calendar.Nav />
      <calendar.Days />
    </PowerCalendar>
  </template>
}
