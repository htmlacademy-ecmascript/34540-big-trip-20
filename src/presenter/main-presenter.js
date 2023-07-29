import {remove, render} from '../framework/render.js';
import {SortType, UserAction, UpdateType} from '../const.js';
import {sortPointDay, sortPointTime, sortPointPrice} from '../utils/point.js';

import TripSortView from '../view/main/trip-sort-view.js';
import TripListContainerView from '../view/main/trip-list-container-view.js';
import TripListEmptyView from '../view/main/trip-list-empty-view.js';

import PointPresenter from './point-presenter.js';

export default class MainPresenter {
  #sortComponent = null;
  #noPointsComponent = new TripListEmptyView();
  #tripEventsListContainer = new TripListContainerView();
  #tripPointsContainer = null;

  #tripsModel = null;

  #currentSortType = SortType.DAY;

  #pointPresenters = new Map();

  constructor({mainContainer, tripsModel}) {
    this.#tripPointsContainer = mainContainer.querySelector('.trip-events');
    this.#tripsModel = tripsModel;

    this.#tripsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderTrip();
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#tripsModel.points].sort(sortPointDay);
      case SortType.TIME:
        return [...this.#tripsModel.points].sort(sortPointTime);
      case SortType.PRICE:
        return [...this.#tripsModel.points].sort(sortPointPrice);
    }

    return this.#tripsModel.points;
  }

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearTrip();
    this.#renderPointsList();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#tripsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#tripsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#tripsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init({
          point: data,
          pointDestination: this.#tripsModel.getDestinationById(data.destination),
          pointOffers: this.#tripsModel.getOffersById(data.type, data.offers)
        });
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
    }
  };

  #renderTrip() {
    if (!this.#tripsModel.points.length) {
      this.#clearSort();
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
    if (this.#sortComponent) {
      return;
    }

    this.#sortComponent = new TripSortView({
      onSortTypeChange: this.#onSortTypeChange
    });
    render(this.#sortComponent, this.#tripPointsContainer);
  }

  #renderPointsList() {
    render(this.#tripEventsListContainer, this.#tripPointsContainer);
    for (let i = 0; i < this.points.length; i++) {
      this.#renderPoint({
        point: this.points[i],
        pointDestination: this.#tripsModel.getDestinationById(this.points[i].destination),
        pointOffers: this.#tripsModel.getOffersById(this.points[i].type, this.points[i].offers)
      });
    }
  }

  #renderPoint(pointInfo) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripEventsListContainer.element,
      tripOffers: this.#tripsModel.offers,
      tripDestinations: this.#tripsModel.destinations,
      onPointChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(pointInfo);
    this.#pointPresenters.set(pointInfo.point.id, pointPresenter);
  }

  #clearTrip({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#noPointsComponent);
    remove(this.#tripEventsListContainer);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #clearSort(){
    remove(this.#sortComponent);
  }
}
