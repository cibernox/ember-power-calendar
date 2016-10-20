import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
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
      this.route('the-day');

      // OTHER
      this.route('api-reference');
    });
  });
  this.route('legacy-demo');
});

export default Router;
