import Component from '@ember/component';
import layout from '../../templates/components/power-calendar/nav';

export default Component.extend({
  layout,
  tagName: '',
  unit: 'month',
  format: 'MMMM YYYY'
});
