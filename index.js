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
      for (let addonName in addons) {
        if (addons[addonName].pkg.keywords.indexOf('ember-power-calendar-adapter') > -1) {
          return true;
        }
      }
      // The above check works for ember-power-calendar-moment 0.1.7+ and for
      // ember-power-calendar-luxon 0.1.8+, but in case someone has an older version I keep this
      // whitelist.
      return Object.hasOwnProperty.call(addons, 'ember-power-calendar-moment') ||
        Object.hasOwnProperty.call(addons, 'ember-power-calendar-luxon');
    }

    if (!hasMetaAddon(hostAppAddons) && !hasMetaAddon(parentAddons)) {
      throw new Error(`You have installed "ember-power-calendar" but you don't have any of the required meta-addons to make it work, like 'ember-power-calendar-moment' or 'ember-power-calendar-luxon'`);
    }
  }
};
