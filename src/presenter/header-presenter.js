import {render, RenderPosition, remove} from '../framework/render.js';
import TripInfoView from '../view/header/trip-info-view.js';
import FilterPresenter from './filter-presenter.js';

export default class HeaderPresenter {
  #container = null;
  #tripModel = null;
  #filterModel = null;
  #tripPoints = null;

  #tripInfoComponent = null;

  constructor({headerContainer, tripModel, filterModel}) {
    this.#container = headerContainer;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.#tripPoints = [...this.#tripModel.points];
    this.renderTripInfo();
    this.#renderTripFilters();
  }

  get #tripTotalPrice() {
    return this.#tripPoints.reduce((totalPrice, {type, basePrice, offers}) => {
      totalPrice += basePrice;

      totalPrice += this.#tripModel.getOffersById(type, offers).reduce((offersPrice, {price}) => {
        offersPrice += price;
        return offersPrice;
      }, 0);

      return totalPrice;
    }, 0);
  }

  renderTripInfo() {
    this.#tripPoints = [...this.#tripModel.points];
    if (this.#tripPoints.length) {
      this.#tripInfoComponent = new TripInfoView({
        tripRouteTitle: 'Amsterdam &mdash; Chamonix &mdash; Geneva',
        tripRouteDates: 'Mar 18&nbsp;&mdash;&nbsp;20',
        tripTotalPrice: this.#tripTotalPrice
      });
      render(this.#tripInfoComponent, this.#container.querySelector('.trip-main'), RenderPosition.AFTERBEGIN);
    }
  }

  #renderTripFilters() {
    if (this.#tripPoints.length) {
      const filterPresenter = new FilterPresenter({
        filterContainer: this.#container.querySelector('.trip-controls__filters'),
        tripModel: this.#tripModel,
        filterModel: this.#filterModel
      });
      filterPresenter.init();
    }
  }

  clearTripInfo() {
    remove(this.#tripInfoComponent);
  }
}
