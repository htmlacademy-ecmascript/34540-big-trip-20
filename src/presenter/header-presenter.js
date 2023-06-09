import {render, RenderPosition} from '../framework/render.js';
import {generateFilter} from '../mock/filter.js';

import TripInfoView from '../view/header/trip-info-view.js';
import TripFiltersView from '../view/header/trip-filters-view.js';

export default class HeaderPresenter {
  #container = null;
  #tripsModel = null;
  #filters = null;
  #tripPoints = null;

  constructor({headerContainer, tripsModel}) {
    this.#container = headerContainer;
    this.#tripsModel = tripsModel;
    this.#filters = generateFilter(this.#tripsModel.points);
    this.tripPoints = [...this.#tripsModel.points];
  }

  init() {
    this.#renderHeader();
  }

  get totalPrice() {
    return this.tripPoints.reduce((totalPrice, {type, basePrice, offers}) => {
      totalPrice += basePrice;

      totalPrice += this.#tripsModel.getOffersById(type, offers).reduce((offersPrice, {price}) => {
        offersPrice += price;
        return offersPrice;
      }, 0);

      return totalPrice;
    }, 0);
  }

  #renderHeader() {
    if (this.tripPoints.length) {
      render(new TripInfoView(this.totalPrice), this.#container.querySelector('.trip-main'), RenderPosition.AFTERBEGIN);
      render(new TripFiltersView(this.#filters), this.#container.querySelector('.trip-controls__filters'));
    }
  }
}
