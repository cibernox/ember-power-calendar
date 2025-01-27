import '@glint/environment-ember-loose';
import '@glint/environment-ember-template-imports';

import type EmberPowerCalendarRegistry from 'ember-power-calendar/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export default interface Registry extends EmberPowerCalendarRegistry {
    // local entries
  }
}
