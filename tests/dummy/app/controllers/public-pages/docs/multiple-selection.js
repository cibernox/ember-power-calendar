import Controller from 'ember-controller';
import moment from 'moment';

const primes = [1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
export default Controller.extend({
  displayedMonth: moment('2016-05-17'),
  collection: [],
  selectedPrimes: [],

  actions: {
    selectClosestPrime(moments) {
      let lastOne = moments[moments.length - 1];
      let number = lastOne.date();
      if (primes.indexOf(number) === -1) {
        let nextPrimeIndex = primes.findIndex((p) => p > number);
        let nextPrime = primes[nextPrimeIndex];
        let prevPrime = primes[nextPrimeIndex - 1];
        let closestPrime = nextPrime - number < number - prevPrime ? nextPrime : prevPrime;
        if (moments.some((m) => m.date() === closestPrime)) {
          moments.pop();
        } else {
          lastOne.date(closestPrime);
        }
      }
      this.set('selectedPrimes', moments);
    }
  }
});