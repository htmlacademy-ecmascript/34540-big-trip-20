import {createElement} from '../../render.js';

const createLoadingViewTemplate = () => '<p class="trip-events__msg">Loading...</p>';

export default class LoadingView {
  getTemplate() {
    return createLoadingViewTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
