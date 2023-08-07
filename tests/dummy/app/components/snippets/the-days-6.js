import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  @tracked wedding = new Date(2013, 9, 18);
  @tracked minDate = new Date(2013, 9, 11);
  @tracked maxDate = new Date(2013, 9, 21);
}
