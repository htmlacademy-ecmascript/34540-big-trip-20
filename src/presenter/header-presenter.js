import {render, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/header/trip-info-view.js';
import FilterPresenter from './filter-presenter.js';

export default class HeaderPresenter {
  #container = null;
  #tripModel = null;
  #filterModel = null;
  #tripPoints = null;

  constructor({headerContainer, tripModel, filterModel}) {
    this.#container = headerContainer;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#tripPoints = [...this.#tripModel.points];
  }

  init() {
    this.#renderHeader();
  }

  get totalPrice() {
    return this.#tripPoints.reduce((totalPrice, {type, basePrice, offers}) => {
      totalPrice += basePrice;

      totalPrice += this.#tripModel.getOffersById(type, offers).reduce((offersPrice, {price}) => {
        offersPrice += price;
        return offersPrice;
      }, 0);

      return totalPrice;
    }, 0);
  }

  #renderHeader() {
    if (this.#tripPoints.length) {
      render(new TripInfoView(this.totalPrice), this.#container.querySelector('.trip-main'), RenderPosition.AFTERBEGIN);

      const filterPresenter = new FilterPresenter({
        filterContainer: this.#container.querySelector('.trip-controls__filters'),
        tripModel: this.#tripModel,
        filterModel: this.#filterModel
      });
      filterPresenter.init();
    }
  }
}
