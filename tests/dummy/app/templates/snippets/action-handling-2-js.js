import Controller from 'ember-controller';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  updateMonth: task(function* (newMonth) {
    yield timeout(600); // Pretend this is an ajax call to the server...
    // ...and that here we update the events somehow
    this.set('displayedMonth', newMonth);
  }).drop()
});