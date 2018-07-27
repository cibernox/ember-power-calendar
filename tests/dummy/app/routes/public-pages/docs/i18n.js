import Route from '@ember/routing/route';
// import { inject } from '@ember/service';

export default Route.extend({
  // moment: inject(),

  deactivate() {
    this._super(...arguments);
    // this.get('moment').changeLocale(false);
  }
});
