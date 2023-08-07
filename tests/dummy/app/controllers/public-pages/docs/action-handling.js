import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

export default class extends Controller {
  selected = new Date('2016-05-17');

  @(task(function* ({ date }) {
    yield timeout(600); // Pretend this is an ajax call to the server
    // here we update the events
    this.set('center', date);
  }).drop())
  updateMonth;
}
