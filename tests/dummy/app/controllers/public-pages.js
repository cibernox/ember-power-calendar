import Ember from 'ember';
import moment from 'moment';

const {
  Controller,
  inject: { controller },
  run
} = Ember;

export default Controller.extend({
  applicationController: controller('application'),
  today: null,
  day: null,

  init() {
    this._super(...arguments);
    let now = moment();
    this.setProperties({ today: now, day: now });
  },

  actions: {
    flipPage(e) {
      if (this.get('applicationController.currentRouteName') === 'public-pages.docs.index') {
        return;
      }
      let pageElement = e.target.closest('.header-calendar-page');
      if (!pageElement) {
        return;
      }
      pageElement.classList.remove('run-animation');
      let clone = pageElement.cloneNode(true);
      let parent = pageElement.parentNode;
      parent.insertBefore(clone, pageElement);
      this.set('day', this.get('day').clone().add(1, 'day'));
      run.later(function() {
        parent.removeChild(clone);
      }, 400);
      run.scheduleOnce('afterRender', function() {
        pageElement.offsetLeft; // force layout
        pageElement.classList.add('run-animation');
      });
    }
  }
});