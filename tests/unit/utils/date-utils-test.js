import { module, test } from 'qunit';
import { add } from 'ember-power-calendar/utils/date-utils';

module('Unit | Utility | date-utils', function() {
  module('#add', function() {
    test('can add seconds', function(assert) {
      let date = new Date(1986, 8, 3, 4, 30, 0, 0);
      let result = add(date, 1, 'second');
      assert.equal(+result, +new Date(1986, 8, 3, 4, 30, 1, 0), 'Can add 1 second');

      result = add(date, 120, 'seconds');
      assert.equal(+result, +new Date(1986, 8, 3, 4, 32, 0, 0), 'Can add 120 second');

      result = add(date, -120, 'seconds');
      assert.equal(+result, +new Date(1986, 8, 3, 4, 28, 0, 0), 'Can add -120 second');
    });

    test('can add minutes', function(assert) {
      let date = new Date(1986, 8, 3, 4, 30, 0, 0);
      let result = add(date, 1, 'minute');
      assert.equal(+result, +new Date(1986, 8, 3, 4, 31, 0, 0), 'Can add 1 minutes');

      result = add(date, 120, 'minutes');
      assert.equal(+result, +new Date(1986, 8, 3, 6, 30, 0, 0), 'Can add 120 minutes');

      result = add(date, -120, 'minutes');
      assert.equal(+result, +new Date(1986, 8, 3, 2, 30, 0, 0), 'Can add -120 minutes');
    });

    test('can add hours', function(assert) {
      let date = new Date(1986, 8, 3, 4, 30, 0, 0);
      let result = add(date, 1, 'hour');
      assert.equal(+result, +new Date(1986, 8, 3, 5, 30, 0, 0), 'Can add 1 hours');

      result = add(date, 120, 'hours');
      assert.equal(+result, +new Date(1986, 8, 4, 2, 30, 0, 0), 'Can add 20 hours');

      result = add(date, -120, 'hours');
      assert.equal(+result, +new Date(1986, 8, 2, 8, 30, 0, 0), 'Can add -20 hours');
    });
  });
});
