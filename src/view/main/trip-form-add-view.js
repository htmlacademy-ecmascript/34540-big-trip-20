import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import {capitalizeFirstLetter} from '../../utils/common.js';
import {POINT_EMPTY} from '../../const.js';
import {getOffersByType} from '../../utils/point.js';

import he from 'he';
import flatpickr from 'flatpickr';

const createTripFormTypesGroupItem = (type) => (
  `<div class="event__type-item">
      <input
        id="event-type-${type}"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
      />
      <label
        class="event__type-label event__type-label--${type}"
        for="event-type-${type}">
            ${capitalizeFirstLetter(type)}
      </label>
    </div>`
);

const createTripFormTypesGroupTemplate = (tripOffers) => (
  `<fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>

        ${tripOffers.reduce((result, {type}) => {
    result += createTripFormTypesGroupItem(type);
    return result;
  }, '')}
   </fieldset>`
);

const createTripFormDestinationsListTemplate = (tripDestinations) => (
  `<datalist id="destination-list">
    ${tripDestinations.reduce((result, {name}) => {
    result += `<option value="${name}"></option>`;
    return result;
  }, '')}
  </datalist>`
);

const createTripFormOffersListTemplate = (point, tripOffers) => {
  const offersByType = getOffersByType(point.type, tripOffers);

  return (
    `${offersByType.length ? `<section class="event__section event__section--offers">
        <h3 class="event__section-title event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offersByType.reduce((result, {id, title, price}) => {
      result += `<div class="event__offer-selector">
            <input class="event__offer-checkbox visually-hidden" id="${id}" type="checkbox" name="${id}"
                ${point.offers.includes(id) ? 'checked' : ''}>
            <label class="event__offer-label" for="${id}">
                <span class="event__offer-title">${he.encode(title)}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
            </label>
          </div>`;
      return result;
    }, '')}
        </div>
    </section>` : ''}`
  );
};

const createTripFormDestinationPictures = (pictures) => (
  `<div class="event__photos-tape">
    ${pictures.reduce((result, {src, description}) => {
    result += `<img class="event__photo" src="${src}" alt="${description}">`;
    return result;
  }, '')}
   </div>`
);

const createTripFormDestinationTemplate = (description, pictures) => (
  `<section class="event__section event__section--destination">
                <h3 class="event__section-title event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${he.encode(description)}</p>
                <div class="event__photos-container">
                    ${createTripFormDestinationPictures(pictures)}
                </div>
           </section>`
);

const createTripFormEditTemplate = (point, tripOffers, tripDestinations) => {
  const {type, basePrice, isDisabled, isSaving} = point;
  const typesGroup = createTripFormTypesGroupTemplate(tripOffers);
  const destinationsList = createTripFormDestinationsListTemplate(tripDestinations);
  const offersList = createTripFormOffersListTemplate(point, tripOffers);

  const pointDestination = tripDestinations.find((destination) => destination.id === point.destination) ?? '';
  const {name = '', description = '', pictures} = pointDestination;
  const destinationInfo = description ? createTripFormDestinationTemplate(description, pictures) : '';

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
          <div class="event__type-wrapper">
              <label class="event__type event__type-btn" for="event-type-toggle">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle visually-hidden" id="event-type-toggle" type="checkbox">

              <div class="event__type-list">
                  ${typesGroup}
              </div>
          </div>

          <div class="event__field-group event__field-group--destination">
              <label class="event__label event__type-output" for="event-destination">
                  ${type}
              </label>
              <input class="event__input event__input--destination" id="event-destination" type="text"
                     name="event-destination" value="${name}" list="destination-list">
              ${destinationsList}
          </div>

          <div class="event__field-group event__field-group--time">
              <label class="visually-hidden" for="event-start-time">From</label>
              <input class="event__input event__input--time" id="event-start-time" type="text" name="event-start-time" value="">
              &mdash;
              <label class="visually-hidden" for="event-end-time">To</label>
              <input class="event__input event__input--time" id="event-end-time" type="text" name="event-end-time" value="">
          </div>

          <div class="event__field-group event__field-group--price">
              <label class="event__label" for="event-price">
                  <span class="visually-hidden">Price</span>
                  &euro;
              </label>
              <input class="event__input event__input--price" id="event-price" type="number" min="0" max="1000000" name="event-price"
                     value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
                ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
          ${offersList}
          ${destinationInfo}
      </section>
    </form>`
  );
};

export default class TripFormAddView extends AbstractStatefulView {
  #tripOffers = null;
  #tripDestinations = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  #onFormSubmit = null;
  #onFormCancel = null;

  constructor({tripModel, onFormSubmit, onCancelClick}) {
    super();
    this._setState(TripFormAddView.parsePointToState(POINT_EMPTY));
    this.#tripOffers = tripModel.offers;
    this.#tripDestinations = tripModel.destinations;
    this.#onFormSubmit = onFormSubmit;
    this.#onFormCancel = onCancelClick;

    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#onTypeChange);
    this.element.querySelector('[name="event-destination"]').addEventListener('change', this.#onDestinationChange);
    this.element.querySelector('[name="event-price"]').addEventListener('input', this.#onPriceChange);

    const $offerBlock = this.element.querySelector('.event__available-offers');
    if ($offerBlock) {
      $offerBlock.addEventListener('change', this.#onOfferClick);
    }

    this.#setDatepicker();
  }

  get template() {
    return createTripFormEditTemplate(
      this._state,
      this.#tripOffers,
      this.#tripDestinations
    );
  }

  #setDatepicker() {
    const [$dateFrom, $dateTo] = this.element.querySelectorAll('.event__input--time');

    this.#datepickerFrom = flatpickr(
      $dateFrom,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        enableTime: true,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true,
        onClose: this.#onDateFromChange
      },
    );

    this.#datepickerTo = flatpickr(
      $dateTo,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        enableTime: true,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true,
        onClose: this.#onDateToChange
      },
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(TripFormAddView.parseStateToPoint(this._state));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFormCancel();
  };

  #onTypeChange = (evt) => {
    const selectedType = evt.target.value;

    this.updateElement({
      type: selectedType,
      offers: getOffersByType(selectedType, this.#tripOffers)
    });
  };

  #onDestinationChange = (evt) => {
    const selectedDestination = evt.target.value;
    const getDestinationbyName = this.#tripDestinations.find(({name}) => name === selectedDestination.trim());

    this.updateElement({
      destination: getDestinationbyName ? getDestinationbyName.id : this._state.destination
    });
  };

  #onDateFromChange = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #onDateToChange = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #onPriceChange = (evt) => {
    evt.preventDefault();

    this._setState({
      basePrice: evt.target.valueAsNumber
    });
  };

  #onOfferClick = (evt) => {
    evt.preventDefault();

    let checkedOffers = [...this._state.offers];
    if (evt.target.checked) {
      checkedOffers.push(evt.target.name);
    } else {
      checkedOffers = checkedOffers.filter((offer) => offer !== evt.target.name);
    }

    this._setState({
      offers: checkedOffers
    });
  };

  reset(pointInfo) {
    this.updateElement(
      TripFormAddView.parsePointToState(pointInfo.point)
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;

    return point;
  }
}
