import { computed } from '@ember/object';

export default function (fallback: any) {
  return computed({
    get() {
      return fallback;
    },
    set(_, v) {
      return v === undefined ? fallback : v;
    }
  });
}
