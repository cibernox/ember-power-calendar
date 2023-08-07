import Component from '@ember/component';
import templateLayout from '../../templates/components/power-calendar/nav';

export default class extends Component {
  layout = templateLayout;
  tagName = '';
  unit = 'month';
  format = 'MMMM YYYY';
}
