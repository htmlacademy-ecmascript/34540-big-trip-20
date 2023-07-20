import {render, replace, remove} from '../framework/render.js';

import TripListContainerItemView from '../view/main/trip-list-container-item-view.js';
import TripPointView from '../view/main/trip-point-view.js';
import TripFormView from '../view/main/trip-form-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointListContainerItem = new TripListContainerItemView();
  #tripPointComponent = null;
  #tripPointEditComponent = null;

  #pointInfo = null;
  #tripOffers = [];
  #tripDestinations = [];

  #onPointChange = null;
  #onModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({pointListContainer, tripOffers, tripDestinations, onPointChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#tripOffers = tripOffers;
    this.#tripDestinations = tripDestinations;
    this.#onPointChange = onPointChange;
    this.#onModeChange = onModeChange;
  }

  init(pointInfo) {
    this.#pointInfo = pointInfo;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointEditComponent = this.#tripPointEditComponent;

    this.#tripPointComponent = new TripPointView({
      pointInfo: this.#pointInfo,
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#onFavoriteClick
    });

    this.#tripPointEditComponent = new TripFormView({
      pointsInfo: {
        point: this.#pointInfo.point,
        tripOffers: this.#tripOffers,
        tripDestinations: this.#tripDestinations
      },
      onFormSubmit: this.#onFormSubmit,
      onHideClick: this.#onHideClick
    });

    if (!prevTripPointComponent || !prevTripPointEditComponent) {
      render(this.#pointListContainerItem, this.#pointListContainer);
      render(this.#tripPointComponent, this.#pointListContainerItem.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripPointEditComponent, prevTripPointEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevTripPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  destroy() {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
    remove(this.#pointListContainerItem);
  }

  #replacePointToForm() {
    this.#onModeChange();
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #onFavoriteClick = () => {
    this.#onPointChange({...this.#pointInfo.point, isFavorite: !this.#pointInfo.point.isFavorite});
  };

  #onEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #onFormSubmit = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #onHideClick = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}

