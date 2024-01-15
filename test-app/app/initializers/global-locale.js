import require from 'require';
import { importSync } from '@embroider/macros';

const dateLibrary = require.has('luxon') ? 'luxon' : 'moment';

export default {
  initialize() {
    if (dateLibrary === 'moment') {
      let moment = importSync('moment').default;
      moment.locale('en');
    }
  },
};
