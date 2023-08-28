import {remove, render, RenderPosition} from '../framework/render.js';
import TripListContainerItemView from '../view/main/trip-list-container-item-view.js';
import TripFormAddView from '../view/main/trip-form-add-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewPointPresenter {
  #tripModel = null;

  #tripEventsListContainer = null;
  #pointListContainerItem = new TripListContainerItemView();
  #pointEditComponent = null;

  #handleDataChange = null;
  #handleDestroy = null;

  constructor({tripEventsListContainer, tripModel, onDataChange, onDestroy}) {
    this.#tripModel = tripModel;
    this.#tripEventsListContainer = tripEventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent) {
      return;
    }

    this.#pointEditComponent = new TripFormAddView({
      tripModel: this.#tripModel,
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick
    });

    render(this.#pointListContainerItem, this.#tripEventsListContainer.element, RenderPosition.AFTERBEGIN);
    render(this.#pointEditComponent, this.#pointListContainerItem.element);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (!this.#pointEditComponent) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointListContainerItem);
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...point, isFavorite: false}
    );
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
