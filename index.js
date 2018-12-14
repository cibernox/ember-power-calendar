'use strict';

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);
    if (['ember-power-calendar-moment', 'ember-power-calendar-luxon'].includes(this.project.name())) {
      return;
    }

    const hostAppAddons = this.project.addonPackages;
    const parentAddons = this.parent.addonPackages;

    const hasMetaAddon = addons => {
      return Object.hasOwnProperty.call(addons, 'ember-power-calendar-moment') ||
        Object.hasOwnProperty.call(addons, 'ember-power-calendar-luxon');
    }

    if (!hasMetaAddon(hostAppAddons) && !hasMetaAddon(parentAddons)) {
      throw new Error(`You have installed "ember-power-calendar" but you don't have any of the required meta-addons to make it work. Please, explicitly install 'ember-power-calendar-moment' or 'ember-power-calendar-luxon' in your app`);
    }
  }
};
