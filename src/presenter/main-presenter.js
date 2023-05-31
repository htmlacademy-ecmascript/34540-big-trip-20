import {render} from '../render.js';
import {POINT_COUNT} from '../const.js';

import TripSortView from '../view/main/trip-sort-view.js';
import TripListContainerView from '../view/main/trip-list-container-view.js';
import TripListContainerItemView from '../view/main/trip-list-container-item-view.js';
import TripPointView from '../view/main/trip-point-view.js';

export default class MainPresenter {
  tripSort = new TripSortView();
  tripEventsListContainer = new TripListContainerView();
  tripEventsListContainerItem = new TripListContainerItemView();

  init = (container) => {
    this.container = container;
    this.tripEventsContainer = container.querySelector('.trip-events');

    render(this.tripSort, this.tripEventsContainer);
    render(this.tripEventsListContainer, this.tripEventsContainer);

    for (let i = 0; i < POINT_COUNT; i++) {
      //render(new TripListContainerItemView(), this.tripEventsListContainer.getElement());
      render(new TripPointView(), this.tripEventsListContainer.getElement());
    }
  };
}
