import {
  dependencySatisfies,
  macroCondition,
  importSync,
} from '@embroider/macros';
import type * as momentNs from 'moment';

let dateLibrary = '';

if (macroCondition(dependencySatisfies('moment', '*'))) {
  dateLibrary = 'moment';
} else if (macroCondition(dependencySatisfies('luxon', '*'))) {
  dateLibrary = 'luxon';
}

export default {
  initialize() {
    if (dateLibrary === 'moment') {
      const moment = (importSync('moment') as { default: typeof momentNs })
        .default;
      moment.locale('en');
    }
  },
};
