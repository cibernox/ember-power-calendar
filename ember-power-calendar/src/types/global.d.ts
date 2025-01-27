import '@glint/environment-ember-loose';

import type EmberTruthRegistry from 'ember-truth-helpers/template-registry';
import type { EmbroiderUtilRegistry } from '@embroider/util';

export interface AssignRegistry {
  [key: string]: any;
}

export interface ReadonlyRegistry {
  [key: string]: any;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry
    extends EmberTruthRegistry,
      EmbroiderUtilRegistry,
      ReadonlyRegistry,
      AssignRegistry /* other registries here */ {
    // ...
  }
}
