import Service from '@ember/service';

export default Service.extend({
  date: null,

  // Methods
  getDate() {
    return this.get('date') || new Date();
  }
});
