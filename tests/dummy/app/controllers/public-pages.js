import Controller from '@ember/controller';
import { later, scheduleOnce } from '@ember/runloop';
import { inject } from '@ember/controller';

export default Controller.extend({
  applicationController: inject('application'),
  today: null,
  day: null,

  init() {
    this._super(...arguments);
    let now = new Date();
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
      later(function() {
        parent.removeChild(clone);
      }, 400);
      scheduleOnce('afterRender', function() {
        pageElement.offsetLeft; // force layout
        pageElement.classList.add('run-animation');
      });
    }
  }
});
