import Controller from '@ember/controller';
import ActionHandling1 from '../../../components/snippets/action-handling-1';
import ActionHandling2 from '../../../components/snippets/action-handling-2';
import ActionHandling3 from '../../../components/snippets/action-handling-3';

export default class extends Controller {
  actionHandling1 = ActionHandling1;
  actionHandling2 = ActionHandling2;
  actionHandling3 = ActionHandling3;
}
