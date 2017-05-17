import { typeOf } from 'ember-utils';

export default function(data) {
  return typeOf(data) === 'number' && data === parseInt(data, 10);
}
