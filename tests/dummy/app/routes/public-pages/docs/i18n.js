import Route from 'ember-route';
import service from 'ember-service/inject';

export default Route.extend({
  moment: service(),

  deactivate() {
    this._super(...arguments);
    this.get('moment').changeLocale(false);
  }
});