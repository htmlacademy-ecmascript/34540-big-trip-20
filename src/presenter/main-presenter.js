import {render} from '../framework/render.js';

import TripSortView from '../view/main/trip-sort-view.js';
import TripListContainerView from '../view/main/trip-list-container-view.js';
import TripListEmptyView from '../view/main/trip-list-empty-view.js';

import PointPresenter from './point-presenter.js';

export default class MainPresenter {
  #sortComponent = new TripSortView();
  #noPointsComponent = new TripListEmptyView();
  #tripEventsListContainer = new TripListContainerView();

  #tripPointsContainer = null;
  #tripsModel = null;

  #pointPresenters = new Map();

  constructor({mainContainer, tripsModel}) {
    this.#tripPointsContainer = mainContainer.querySelector('.trip-events');
    this.#tripsModel = tripsModel;
  }

  init() {
    this.tripPoints = [...this.#tripsModel.points];
    this.tripOffers = [...this.#tripsModel.offers];
    this.tripDestinations = [...this.#tripsModel.destinations];

    this.#renderTrip();
  }

  #renderTrip() {
    if (!this.tripPoints.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#tripPointsContainer);
  }

  #renderSort() {
    render(this.#sortComponent, this.#tripPointsContainer);
  }

  #renderPointsList() {
    render(this.#tripEventsListContainer, this.#tripPointsContainer);
    for (let i = 0; i < this.tripPoints.length; i++) {
      this.#renderPoint({
        point: this.tripPoints[i],
        pointDestination: this.#tripsModel.getDestinationById(this.tripPoints[i].destination),
        pointOffers: this.#tripsModel.getOffersById(this.tripPoints[i].type, this.tripPoints[i].offers)
      });
    }
  }

  #renderPoint(pointInfo) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripEventsListContainer.element,
      tripOffers: this.tripOffers,
      tripDestinations: this.tripDestinations
    });

    pointPresenter.init(pointInfo);
    this.#pointPresenters.set(pointInfo.point.id, pointPresenter);
  }

  #clearTripList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
