import Component from '@ember/component';
import { layout, tagName } from "@ember-decorators/component";
import templateLayout from '../../templates/components/power-calendar/nav';

export default @layout(templateLayout) @tagName('') class extends Component {
  unit = 'month'
  format = 'MMMM YYYY'
}
