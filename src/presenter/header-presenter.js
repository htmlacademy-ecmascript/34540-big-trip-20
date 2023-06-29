import {render, RenderPosition} from '../framework/render.js';
import {generateFilter} from '../mock/filter.js';

import TripInfoView from '../view/header/trip-info-view.js';
import TripFiltersView from '../view/header/trip-filters-view.js';

export default class HeaderPresenter {
  #container = null;
  #tripsModel = null;
  #filters = null;

  constructor({headerContainer, tripsModel}) {
    this.#container = headerContainer;
    this.#tripsModel = tripsModel;
    this.#filters = generateFilter(this.#tripsModel.points);
  }

  init() {
    this.#renderHeader();
  }

  #renderHeader() {
    render(new TripInfoView(), this.#container.querySelector('.trip-main'), RenderPosition.AFTERBEGIN);
    render(new TripFiltersView(this.#filters), this.#container.querySelector('.trip-controls__filters'));
  }
}
