import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  updateMonth: task(function* ({ date }) {
    yield timeout(600); // Pretend this is an ajax call to the server...
    // ...and that here we update the events somehow
    this.set('center', date);
  }).drop()
});