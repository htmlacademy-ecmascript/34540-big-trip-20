import {render, replace} from '../framework/render.js';

import TripListContainerItemView from '../view/main/trip-list-container-item-view.js';
import TripPointView from '../view/main/trip-point-view.js';
import TripFormView from '../view/main/trip-form-view.js';

export default class PointPresenter {
  #pointListContainer = null;
  #pointListContainerItem = new TripListContainerItemView();

  #tripPointComponent = null;
  #tripPointEditComponent = null;

  #tripOffers = [];
  #tripDestinations = [];
  #pointInfo = null;

  constructor({pointListContainer, tripOffers, tripDestinations}) {
    this.#pointListContainer = pointListContainer;
    this.#tripOffers = tripOffers;
    this.#tripDestinations = tripDestinations;
  }

  init(pointInfo) {
    this.#pointInfo = pointInfo;

    this.#tripPointComponent = new TripPointView({
      pointInfo: this.#pointInfo,
      onEditClick: this.#onEditClick
    });

    this.#tripPointEditComponent = new TripFormView({
      pointsInfo: {
        point: this.#pointInfo.point,
        pointDestination: this.#pointInfo.pointDestination,
        tripOffers: this.#tripOffers,
        tripDestinations: this.#tripDestinations
      },
      onFormSubmit: this.#onFormSubmit,
      onHideClick: this.#onHideClick
    });

    render(this.#pointListContainerItem, this.#pointListContainer);
    render(this.#tripPointComponent, this.#pointListContainerItem.element);
  }


  #replacePointToForm(){
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
  }

  #replaceFormToPoint(){
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #onEditClick = () =>{
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #onFormSubmit = () =>{
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #onHideClick = () =>{
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}

