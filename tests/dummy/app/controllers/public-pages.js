import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { add } from 'ember-power-calendar-utils';
import { task, timeout, waitForQueue } from 'ember-concurrency';

export default class extends Controller {
  @service router;
  now = new Date();
  today = this.now;
  day = this.now;

  @(task(function* (e) {
    if (this.router.currentRouteName === 'public-pages.docs.index') {
      return;
    }
    let pageElement = e.target.closest('.header-calendar-page');
    if (!pageElement) {
      return;
    }
    let clone = pageElement.cloneNode(true);
    let parent = pageElement.parentNode;
    parent.insertBefore(clone, pageElement);
    this.set('day', add(this.day, 1, 'day'));

    yield waitForQueue('afterRender');

    pageElement.offsetLeft; // force layout
    pageElement.classList.add('run-animation');

    yield timeout(400);

    pageElement.classList.remove('run-animation');
    parent.removeChild(clone);
  }).drop())
  flipPage;
}
