import {render} from '../framework/render.js';

import TripSortView from '../view/main/trip-sort-view.js';
import TripListContainerView from '../view/main/trip-list-container-view.js';
import TripListContainerItemView from '../view/main/trip-list-container-item-view.js';
import TripPointView from '../view/main/trip-point-view.js';
import TripFormView from '../view/main/trip-form-view.js';

export default class MainPresenter {
  #mainContainer = null;
  #tripsModel = null;

  #tripEventsListContainer = new TripListContainerView();
  #tripFormEditItem = new TripListContainerItemView();

  constructor({mainContainer, tripsModel}) {
    this.#mainContainer = mainContainer;
    this.#tripsModel = tripsModel;
  }

  init = () => {
    this.tripEventsContainer = this.#mainContainer.querySelector('.trip-events');
    this.tripPoints = [...this.#tripsModel.points];
    this.tripOffers = [...this.#tripsModel.offers];
    this.tripDestinations = [...this.#tripsModel.destinations];

    render(new TripSortView(), this.tripEventsContainer);
    render(this.#tripEventsListContainer, this.tripEventsContainer);
    render(this.#tripFormEditItem, this.#tripEventsListContainer.element);
    render(new TripFormView({
      point: this.tripPoints[1],
      pointDestination: this.#tripsModel.getDestinationById(this.tripPoints[1].destination),
      tripOffers: this.tripOffers,
      tripDestinations: this.tripDestinations
    }), this.#tripFormEditItem.element);

    for (let i = 0; i < this.tripPoints.length; i++) {
      const tripEventsListContainerItem = new TripListContainerItemView();

      render(tripEventsListContainerItem, this.#tripEventsListContainer.element);
      render(new TripPointView({
        point: this.tripPoints[i],
        pointDestination: this.#tripsModel.getDestinationById(this.tripPoints[i].destination),
        pointOffers: this.#tripsModel.getOffersById(this.tripPoints[i].type, this.tripPoints[i].offers)
      }), tripEventsListContainerItem.element);
    }
  };
}
