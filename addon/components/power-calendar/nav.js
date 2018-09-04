import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../../templates/components/power-calendar/nav';

const templateMap = {
  'month': 'MMMM YYYY',
  'year': 'YYYY'
}

export default Component.extend({
  layout,
  tagName: '',
  by: 'month',

  dateTemplate: computed('by', function() {
    return templateMap[this.get('by')];
  })
});
