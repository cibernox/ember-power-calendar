import Controller from '@ember/controller';
import { later, scheduleOnce } from '@ember/runloop';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { add } from 'ember-power-calendar-utils';

export default class extends Controller {
  @service router
  now = new Date()
  today = this.now
  day = this.now

  @action
  flipPage(e) {
    if (this.router.currentRouteName === 'public-pages.docs.index') {
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
    this.set('day', add(this.get('day'), 1, 'day'));
    later(function() {
      parent.removeChild(clone);
    }, 400);
    scheduleOnce('afterRender', function() {
      pageElement.offsetLeft; // force layout
      pageElement.classList.add('run-animation');
    });
  }
}
