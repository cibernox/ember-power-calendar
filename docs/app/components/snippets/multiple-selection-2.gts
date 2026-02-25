import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import PowerCalendarMultiple from 'ember-power-calendar/components/power-calendar-multiple';
import type { NormalizeMultipleActionValue } from 'ember-power-calendar/utils';

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

export default class extends Component {
  @tracked center: Date = new Date('2016-05-17');
  @tracked selectedPrimes: Date[] = [];

  @action
  selectClosestPrime(selected: NormalizeMultipleActionValue) {
    const dates = selected.date;

    const lastOne = dates[dates.length - 1];

    if (!lastOne) {
      return;
    }

    const number = lastOne.getDate();

    if (primes.indexOf(number) === -1) {
      const nextPrimeIndex = primes.findIndex((p) => p > number);
      const nextPrime = primes[nextPrimeIndex] ?? 0;
      const prevPrime = primes[nextPrimeIndex - 1] ?? 0;
      const closestPrime =
        nextPrime - number < number - prevPrime ? nextPrime : prevPrime;
      if (dates.some((m) => m.getDate() === closestPrime)) {
        dates.pop();
      } else {
        lastOne.setDate(closestPrime);
      }
    }

    this.selectedPrimes = dates;
  }

  <template>
    <PowerCalendarMultiple
      @center={{this.center}}
      @selected={{this.selectedPrimes}}
      @onSelect={{this.selectClosestPrime}}
      as |calendar|
    >
      <calendar.Nav />
      <calendar.Days />
    </PowerCalendarMultiple>
  </template>
}
