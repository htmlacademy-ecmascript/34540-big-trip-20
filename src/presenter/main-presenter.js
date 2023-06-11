import {render} from '../render.js';

import TripSortView from '../view/main/trip-sort-view.js';
import TripListContainerView from '../view/main/trip-list-container-view.js';
import TripListContainerItemView from '../view/main/trip-list-container-item-view.js';
import TripPointView from '../view/main/trip-point-view.js';
import TripFormView from '../view/main/trip-form-view.js';

export default class MainPresenter {
  tripEventsListContainer = new TripListContainerView();
  tripFormEditItem = new TripListContainerItemView();

  constructor({mainContainer, tripsModel}) {
    this.mainContainer = mainContainer;
    this.tripsModel = tripsModel;
  }

  init = () => {
    this.tripEventsContainer = this.mainContainer.querySelector('.trip-events');
    this.tripPoints = [...this.tripsModel.getPoints()];
    this.tripOffers = [...this.tripsModel.getOffers()];
    this.tripDestinations = [...this.tripsModel.getDestinations()];

    render(new TripSortView(), this.tripEventsContainer);
    render(this.tripEventsListContainer, this.tripEventsContainer);
    render(this.tripFormEditItem, this.tripEventsListContainer.getElement());
    render(new TripFormView({
      point: this.tripPoints[1],
      pointDestinations: this.tripsModel.getDestinationById(this.tripPoints[1].destination),
      tripOffers: this.tripOffers,
      tripDestinations: this.tripDestinations
    }), this.tripFormEditItem.getElement());

    for (let i = 0; i < this.tripPoints.length; i++) {
      const tripEventsListContainerItem = new TripListContainerItemView();

      render(tripEventsListContainerItem, this.tripEventsListContainer.getElement());
      render(new TripPointView({
        point: this.tripPoints[i],
        destination: this.tripsModel.getDestinationById(this.tripPoints[i].destination),
        offers: this.tripsModel.getOffersById(this.tripPoints[i].type, this.tripPoints[i].offers)
      }), tripEventsListContainerItem.getElement());
    }
  };
}
