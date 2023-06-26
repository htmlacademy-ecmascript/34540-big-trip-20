import {render, replace} from '../framework/render.js';

import TripSortView from '../view/main/trip-sort-view.js';
import TripListContainerView from '../view/main/trip-list-container-view.js';
import TripListContainerItemView from '../view/main/trip-list-container-item-view.js';
import TripPointView from '../view/main/trip-point-view.js';
import TripFormView from '../view/main/trip-form-view.js';

export default class MainPresenter {
  #mainContainer = null;
  #tripsModel = null;

  #tripEventsListContainer = new TripListContainerView();

  constructor({mainContainer, tripsModel}) {
    this.#mainContainer = mainContainer;
    this.#tripsModel = tripsModel;
  }

  init() {
    this.tripEventsContainer = this.#mainContainer.querySelector('.trip-events');
    this.tripPoints = [...this.#tripsModel.points];
    this.tripOffers = [...this.#tripsModel.offers];
    this.tripDestinations = [...this.#tripsModel.destinations];

    this.#renderTrip();
  }

  #renderTrip() {
    render(new TripSortView(), this.tripEventsContainer);

    render(this.#tripEventsListContainer, this.tripEventsContainer);
    for (let i = 0; i < this.tripPoints.length; i++) {
      this.#renderPoint({
        point: this.tripPoints[i],
        pointDestination: this.#tripsModel.getDestinationById(this.tripPoints[i].destination),
        pointOffers: this.#tripsModel.getOffersById(this.tripPoints[i].type, this.tripPoints[i].offers)
      }, i);
    }
  }

  #renderPoint(pointInfo, index) {
    const tripEventsListContainerItem = new TripListContainerItemView();

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const tripPointComponent = new TripPointView({
      pointInfo,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const tripPointEditComponent = new TripFormView({
      pointInfo: {
        point: this.tripPoints[index],
        pointDestination: this.#tripsModel.getDestinationById(this.tripPoints[index].destination),
        tripOffers: this.tripOffers,
        tripDestinations: this.tripDestinations
      },
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onHideClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(tripPointEditComponent, tripPointComponent);
    }

    function replaceFormToPoint() {
      replace(tripPointComponent, tripPointEditComponent);
    }

    render(tripEventsListContainerItem, this.#tripEventsListContainer.element);
    render(tripPointComponent, tripEventsListContainerItem.element);
  }
}
