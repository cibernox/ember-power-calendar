import '@glint/environment-ember-loose';
import '@glint/environment-ember-template-imports';

import type EmberPowerCalendarRegistry from 'ember-power-calendar/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends EmberPowerCalendarRegistry {
    // local entries
  }
}
