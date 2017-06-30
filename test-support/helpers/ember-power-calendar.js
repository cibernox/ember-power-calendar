import Test from "ember-test";
import { calendarSelect, calendarCenter } from "ember-power-calendar/test-support";

export default function() {
  Test.registerAsyncHelper("calendarCenter", function(app, selector, newCenter) {
    return calendarCenter(app, selector, newCenter);
  });

  Test.registerAsyncHelper("calendarSelect", function(app, selector, selected) {
    return calendarSelect(app, selector, selected);
  });
}
