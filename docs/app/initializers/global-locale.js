import {
  dependencySatisfies,
  macroCondition,
  importSync,
} from '@embroider/macros';

let dateLibrary = '';

if (macroCondition(dependencySatisfies('moment', '*'))) {
  dateLibrary = 'moment';
} else if (macroCondition(dependencySatisfies('luxon', '*'))) {
  dateLibrary = 'luxon';
}

export default {
  initialize() {
    if (dateLibrary === 'moment') {
      let moment = importSync('moment').default;
      moment.locale('en');
    }
  },
};
