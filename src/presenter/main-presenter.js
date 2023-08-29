import {render, RenderPosition, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {UiTimeLimit, SortType, FilterType, UserAction, UpdateType} from '../const.js';
import {sortPointDay, sortPointTime, sortPointPrice} from '../utils/point.js';
import {filter} from '../utils/filter.js';
import HeaderPresenter from './header-presenter.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import TripSortView from '../view/main/trip-sort-view.js';
import TripListContainerView from '../view/main/trip-list-container-view.js';
import TripListEmptyView from '../view/main/trip-list-empty-view.js';
import NewPointButtonView from '../view/header/new-point-button-view.js';
import LoadingView from '../view/main/loading-view.js';

export default class MainPresenter {
  #uiBlocker = new UiBlocker({
    lowerLimit: UiTimeLimit.LOWER_LIMIT,
    upperLimit: UiTimeLimit.UPPER_LIMIT
  });

  #newPointButtonComponent = null;
  #sortComponent = null;
  #noPointsComponent = null;
  #headerContainer = null;
  #loadingComponent = new LoadingView();
  #tripEventsListContainer = new TripListContainerView();
  #tripPointsContainer = null;

  #tripModel = null;
  #filterModel = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #headerPresenter = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;

  #isLoading = true;

  constructor({headerContainer, mainContainer, tripModel, filterModel}) {
    this.#headerContainer = headerContainer;
    this.#tripPointsContainer = mainContainer.querySelector('.trip-events');
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      tripEventsListContainer: this.#tripEventsListContainer,
      tripModel: this.#tripModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointFormClose
    });

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
      default:
        return filteredPoints;
    }
  }

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearTrip();
    this.#renderPointsList();
  };

  #createHeader() {
    this.#headerPresenter = new HeaderPresenter({
      headerContainer: this.#headerContainer,
      tripModel: this.#tripModel,
      filterModel: this.#filterModel
    });
    this.#headerPresenter.init();

    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick
    });
    render(this.#newPointButtonComponent, this.#headerContainer.querySelector('.trip-main'));
  }

  #createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }
  }

  #handleNewPointButtonClick = () => {
    this.#createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #handleNewPointFormClose = () => {
    this.#renderNoPointsComponent();
    this.#newPointButtonComponent.element.disabled = false;
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#tripModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#tripModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#tripModel.deletePoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#createHeader();
        this.#renderTrip();
        break;
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
        this.#headerPresenter.renderTripInfo();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        this.#headerPresenter.renderTripInfo();
        break;
    }
  };

  #renderTrip() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (!this.points.length) {
      this.#clearSort();
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripPointsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoPointsComponent() {
    if (!this.points.length) {
      this.#renderNoPoints();
    }
  }

  #renderNoPoints() {
    this.#noPointsComponent = new TripListEmptyView({
      filterType: this.#filterType
    });

    render(this.#tripEventsListContainer, this.#tripPointsContainer);
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
    this.#headerPresenter.clearTripInfo();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();

    remove(this.#loadingComponent);
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

  #clearSort() {
    remove(this.#sortComponent);
  }
}
