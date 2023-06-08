import {render} from '../render.js';

import TripSortView from '../view/main/trip-sort-view.js';
import TripListContainerView from '../view/main/trip-list-container-view.js';
import TripListContainerItemView from '../view/main/trip-list-container-item-view.js';
import TripPointView from '../view/main/trip-point-view.js';
import TripFormEditView from '../view/main/trip-form-edit-view.js';

export default class MainPresenter {
  tripEventsListContainer = new TripListContainerView();
  tripFormEditItem = new TripListContainerItemView();

  constructor({mainContainer, pointsModel}) {
    this.mainContainer = mainContainer;
    this.pointsModel = pointsModel;
  }

  init = () => {
    this.tripEventsContainer = this.mainContainer.querySelector('.trip-events');
    this.tripPoints = [...this.pointsModel.getPoints()];

    render(new TripSortView(), this.tripEventsContainer);
    render(this.tripEventsListContainer, this.tripEventsContainer);
    render(this.tripFormEditItem, this.tripEventsListContainer.getElement());
    render(new TripFormEditView(), this.tripFormEditItem.getElement());

    for (let i = 0; i < this.tripPoints.length; i++) {
      const tripEventsListContainerItem = new TripListContainerItemView();

      render(tripEventsListContainerItem, this.tripEventsListContainer.getElement());
      render(new TripPointView({point: this.tripPoints[i]}), tripEventsListContainerItem.getElement());
    }
  };
}
