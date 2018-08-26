import require from "require";

const dateLibrary = require.has("luxon") ? "luxon" : "moment";

export default {
  initialize() {
    if (dateLibrary === 'moment') {
      let moment = require('moment').default;
      moment.locale("en");
    }
  }
}
