import AbstractView from '../../framework/view/abstract-view.js';

const createTripListContainerItemTemplate = () => '<li class="trip-events__item"></li>';

export default class TripListContainerItemView extends AbstractView {
  get template() {
    return createTripListContainerItemTemplate();
  }
}
