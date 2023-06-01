import {createElement} from '../../render.js';

const createTripListContainerItemTemplate = () => '<li class="trip-events__item"></li>';

export default class TripListContainerItemView {
  getTemplate() {
    return createTripListContainerItemTemplate();
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
