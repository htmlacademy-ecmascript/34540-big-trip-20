import {render, RenderPosition} from '../framework/render.js';

import TripInfoView from '../view/header/trip-info-view.js';
import TripFiltersView from '../view/header/trip-filters-view.js';

export default class HeaderPresenter {
  #container = null;

  #tripInfo = new TripInfoView();
  #tripFilters = new TripFiltersView();

  constructor({headerContainer}) {
    this.#container = headerContainer;
  }

  init() {
    render(this.#tripInfo, this.#container.querySelector('.trip-main'), RenderPosition.AFTERBEGIN);
    render(this.#tripFilters, this.#container.querySelector('.trip-controls__filters'));
  }
}
