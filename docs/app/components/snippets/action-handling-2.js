import Component from '@glimmer/component';
import { dropTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  @tracked center;
  @tracked selected;

  updateMonth = dropTask(async ({ date }) => {
    await timeout(600); // Pretend this is an ajax call to the server...
    // ...and that here we update the events somehow
    this.center = date;
  });
}
