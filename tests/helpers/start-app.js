import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import registerPowerCalendarHelpers from '../../tests/helpers/ember-power-calendar';

registerPowerCalendarHelpers();

export default function startApp(attrs) {
  let application;

  // use defaults, but you can override
  let attributes = Ember.merge(Ember.merge({}, config.APP), attrs);

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
