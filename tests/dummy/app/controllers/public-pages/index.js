import Controller from '@ember/controller';

export default Controller.extend({
  today: null,

  init() {
    this._super(...arguments);
    this.set('today', new Date());
  }
});
