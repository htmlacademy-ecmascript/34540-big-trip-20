import {render, RenderPosition} from '../framework/render.js';

import TripInfoView from '../view/header/trip-info-view.js';
import TripFiltersView from '../view/header/trip-filters-view.js';

export default class HeaderPresenter {
  tripInfo = new TripInfoView();
  tripFilters = new TripFiltersView();
  init = (container) => {
    this.container = container;

    render(this.tripInfo, this.container.querySelector('.trip-main'), RenderPosition.AFTERBEGIN);
    render(this.tripFilters, this.container.querySelector('.trip-controls__filters'));
  };
}
