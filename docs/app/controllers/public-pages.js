import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { add } from 'ember-power-calendar/utils';
import { dropTask, timeout, waitForQueue } from 'ember-concurrency';

export default class extends Controller {
  @service router;

  @tracked day = this.now;

  now = new Date();
  today = this.now;

  flipPage = dropTask(async (e) => {
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
    this.day = add(this.day, 1, 'day');

    await waitForQueue('afterRender');

    pageElement.offsetLeft; // force layout
    pageElement.classList.add('run-animation');

    await timeout(400);

    pageElement.classList.remove('run-animation');
    parent.removeChild(clone);
  });
}
