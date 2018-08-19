'use strict';

module.exports = {
  name: 'ember-power-calendar',

  included() {
    let { registry: { availablePlugins } } = this._findHost()
    this._super.included.apply(this, arguments);
    if (!availablePlugins.hasOwnProperty('ember-power-calendar-moment') && !availablePlugins.hasOwnProperty('ember-power-calendar-luxon')) {
      throw new Error(`You have installed "ember-power-calendar" but you don't have any of the required meta-addons to make it work. Please, explicitly install 'ember-power-calendar-moment' or 'ember-power-calendar-luxon' in your app`);
    }
  }
};
