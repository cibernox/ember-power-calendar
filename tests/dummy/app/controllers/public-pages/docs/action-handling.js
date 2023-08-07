import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import ActionHandling1 from '../../../components/snippets/action-handling-1';
import ActionHandling2 from '../../../components/snippets/action-handling-2';
import ActionHandling3 from '../../../components/snippets/action-handling-3';

export default class extends Controller {
  actionHandling1 = ActionHandling1;
  actionHandling2 = ActionHandling2;
  actionHandling3 = ActionHandling3;
  
  selected = new Date('2016-05-17');

  @(task(function* ({ date }) {
    yield timeout(600); // Pretend this is an ajax call to the server
    // here we update the events
    this.set('center', date);
  }).drop())
  updateMonth;
}
