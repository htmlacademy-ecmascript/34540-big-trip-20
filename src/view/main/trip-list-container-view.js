import {createElement} from '../../render.js';

const createTripListContainerTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripListContainerView {
  getTemplate() {
    return createTripListContainerTemplate();
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
