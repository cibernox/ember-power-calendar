import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';
import Application from '../../app';
import config from '../../config/environment';
import registerPowerCalendarHelpers from '../../tests/helpers/ember-power-calendar';

registerPowerCalendarHelpers();

export default function startApp(attrs) {
  let attributes = assign({}, config.APP);
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
