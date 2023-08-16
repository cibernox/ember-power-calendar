import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

export default class extends Component {
  @tracked center = new Date('2016-05-17');
  @tracked collection = [];
  @tracked selectedPrimes = [];

  @action
  selectClosestPrime(selected) {
    let dates = selected.date;

    let lastOne = dates[dates.length - 1];
    let number = lastOne.getDate();
    if (primes.indexOf(number) === -1) {
      let nextPrimeIndex = primes.findIndex((p) => p > number);
      let nextPrime = primes[nextPrimeIndex];
      let prevPrime = primes[nextPrimeIndex - 1];
      let closestPrime =
        nextPrime - number < number - prevPrime ? nextPrime : prevPrime;
      if (dates.some((m) => m.getDate() === closestPrime)) {
        dates.pop();
      } else {
        lastOne.setDate(closestPrime);
      }
    }

    this.selectedPrimes = dates;
  }
}
