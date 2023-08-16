import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  @tracked center;
  @tracked selected;

  @(task(function* ({ date }) {
    yield timeout(600); // Pretend this is an ajax call to the server...
    // ...and that here we update the events somehow
    this.center = date;
  }).drop())
  updateMonth;
}
