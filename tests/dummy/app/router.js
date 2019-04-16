import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('public-pages', { path: '' }, function() {
    this.route('docs', function() {
      // GETTING STARTED
      // index.hbs is "Overview"
      this.route('installation');
      this.route('how-to-use-it');
      this.route('action-handling');
      this.route('range-selection');
      this.route('multiple-selection');

      // BASIC CUSTOMIZATION
      this.route('i18n');
      this.route('the-nav');
      this.route('the-days');

      // OTHER
      this.route('test-helpers');
      this.route('api-reference');
    });

    this.route('cookbook', function() {
      this.route('datepicker');
      this.route('nav-select');
      this.route('multiple-months');
    });

    this.route('addons', function() {
      this.route('index');
    });

    this.route('support-the-project');
  });
  this.route('helpers-testing');
});

export default Router;
