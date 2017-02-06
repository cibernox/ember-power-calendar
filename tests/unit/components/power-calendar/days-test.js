import { moduleForComponent, test } from 'ember-qunit';
import moment from 'moment';

moduleForComponent('power-calendar/days', 'Unit | Component | power calendar/days', {
  needs: ['service:power-calendar'],
  unit: true
});

test('It sets the weeks id correctly', function(assert) {
  let component = this.subject({
    calendar: {
      center: moment(new Date(2013, 9, 18))
    }
  });
  assert.equal(component.get('weeks.4.id'), '2013-44', 'The weeks id is set correctly');
});
