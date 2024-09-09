import '@glint/environment-ember-loose';

import type EmberTruthRegistry from 'ember-truth-helpers/template-registry';
import type { EmbroiderUtilRegistry } from '@embroider/util';

export interface AssignRegistry {
  [key: string]: any;
}

export interface ReadonlyRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

declare module '@glint/environment-ember-loose/registry' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export default interface Registry
    extends EmberTruthRegistry,
      EmbroiderUtilRegistry,
      ReadonlyRegistry,
      AssignRegistry /* other registries here */ {
    // ...
  }
}
