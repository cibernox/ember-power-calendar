import '@glint/environment-ember-loose';
import '@glint/environment-ember-template-imports';

import type EmberPowerCalendarRegistry from 'ember-power-calendar/template-registry';

export interface CodeSnippetRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends EmberPowerCalendarRegistry, CodeSnippetRegistry {}
}
