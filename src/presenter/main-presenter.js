import {render} from '../render.js';
import {POINT_COUNT} from '../const.js';

import TripSortView from '../view/main/trip-sort-view.js';
import TripListContainerView from '../view/main/trip-list-container-view.js';
import TripListContainerItemView from '../view/main/trip-list-container-item-view.js';
import TripPointView from '../view/main/trip-point-view.js';
import TripFormEditView from '../view/main/trip-form-edit-view.js';

export default class MainPresenter {
  tripEventsListContainer = new TripListContainerView();
  tripFormEditItem = new TripListContainerItemView();

  init = (container) => {
    this.container = container;
    this.tripEventsContainer = this.container.querySelector('.trip-events');

    // Add the "Sort form"
    render(new TripSortView(), this.tripEventsContainer);

    // Add the trip list container <ul>
    render(this.tripEventsListContainer, this.tripEventsContainer);

    // Add the "Edit form"
    render(this.tripFormEditItem, this.tripEventsListContainer.getElement());
    render(new TripFormEditView(), this.tripFormEditItem.getElement());

    // Add trip points
    for (let i = 0; i < POINT_COUNT; i++) {
      const tripEventsListContainerItem = new TripListContainerItemView();

      render(tripEventsListContainerItem, this.tripEventsListContainer.getElement());
      render(new TripPointView(), tripEventsListContainerItem.getElement());
    }
  };
}
