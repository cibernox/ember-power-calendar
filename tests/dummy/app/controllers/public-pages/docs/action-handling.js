import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  selected: new Date('2016-05-17'),

  updateMonth: task(function* ({ date }) {
    yield timeout(600); // Pretend this is an ajax call to the server
    // here we update the events
    this.set('center', date);
  }).drop()
});
