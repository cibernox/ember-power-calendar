import Ember from 'ember';

export default Ember.Service.extend({
  date: null,
  getDate() {
    return this.get('date') || new Date();
  }
});
