import {remove, render} from '../framework/render.js';
import {SortType, FilterType, UserAction, UpdateType} from '../const.js';
import {sortPointDay, sortPointTime, sortPointPrice} from '../utils/point.js';
import {filter} from '../utils/filter.js';
import TripSortView from '../view/main/trip-sort-view.js';
import TripListContainerView from '../view/main/trip-list-container-view.js';
import TripListEmptyView from '../view/main/trip-list-empty-view.js';
import PointPresenter from './point-presenter.js';

export default class MainPresenter {
  #sortComponent = null;
  #noPointsComponent = null;
  #tripEventsListContainer = new TripListContainerView();
  #tripPointsContainer = null;

  #tripModel = null;
  #filterModel = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #pointPresenters = new Map();

  constructor({mainContainer, tripModel, filterModel}) {
    this.#tripPointsContainer = mainContainer.querySelector('.trip-events');
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;

    this.#tripModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderTrip();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#tripModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortPointDay);
      case SortType.TIME:
        return filteredPoints.sort(sortPointTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointPrice);
    }

    return filteredPoints;
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
        this.#tripModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#tripModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#tripModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init({
          point: data,
          pointDestination: this.#tripModel.getDestinationById(data.destination),
          pointOffers: this.#tripModel.getOffersById(data.type, data.offers)
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
    if (!this.points.length) {
      this.#clearSort();
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }

  #renderNoPoints() {
    this.#noPointsComponent = new TripListEmptyView({
      filterType: this.#filterType
    });

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
        pointDestination: this.#tripModel.getDestinationById(this.points[i].destination),
        pointOffers: this.#tripModel.getOffersById(this.points[i].type, this.points[i].offers)
      });
    }
  }

  #renderPoint(pointInfo) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripEventsListContainer.element,
      tripOffers: this.#tripModel.offers,
      tripDestinations: this.#tripModel.destinations,
      onPointChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(pointInfo);
    this.#pointPresenters.set(pointInfo.point.id, pointPresenter);
  }

  #clearTrip({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#tripEventsListContainer);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
      this.#currentSortType = SortType.DAY;
    }
  }

  #clearSort(){
    remove(this.#sortComponent);
  }
}
