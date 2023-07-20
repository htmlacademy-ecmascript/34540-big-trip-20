import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import {capitalizeFirstLetter, humanizeDate} from '../../utils/common.js';
import {POINT_EMPTY, DateFormat} from '../../const.js';
import {getOffersByType} from '../../utils/point.js';

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
  `<datalist id="destination-list-1">
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
                <span class="event__offer-title">${title}</span>
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

const createTripFormEditTemplate = (point, tripOffers, tripDestinations) => {
  const {type, basePrice} = point;
  const pointDestination = tripDestinations.find((destination) => destination.id === point.destination);
  const {name = '', description = ''} = pointDestination;
  const calendarDateFrom = humanizeDate(point.dateFrom, DateFormat.DATE_TIME);
  const calendarDateTo = humanizeDate(point.dateTo, DateFormat.DATE_TIME);
  const typesGroup = createTripFormTypesGroupTemplate(tripOffers);
  const destinationsList = createTripFormDestinationsListTemplate(tripDestinations);
  const offersList = createTripFormOffersListTemplate(point, tripOffers);

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
          <div class="event__type-wrapper">
              <label class="event__type event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

              <div class="event__type-list">
                  ${typesGroup}
              </div>
          </div>

          <div class="event__field-group event__field-group--destination">
              <label class="event__label event__type-output" for="event-destination-1">
                  ${type}
              </label>
              <input class="event__input event__input--destination" id="event-destination-1" type="text"
                     name="event-destination" value="${name}" list="destination-list-1">
              ${destinationsList}
          </div>

          <div class="event__field-group event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time"
                     value="${calendarDateFrom}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time"
                     value="${calendarDateTo}">
          </div>

          <div class="event__field-group event__field-group--price">
              <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
              </label>
              <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price"
                     value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
          </button>
      </header>
      <section class="event__details">
          ${offersList}
           <section class="event__section event__section--destination">
                <h3 class="event__section-title event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${description}</p>
           </section>
      </section>
    </form>`
  );
};

export default class TripFormView extends AbstractStatefulView {
  #tripOffers = null;
  #tripDestinations = null;

  #onHideClick = null;
  #onFormSubmit = null;

  constructor({pointsInfo, onFormSubmit, onHideClick}) {
    super();
    this._setState(pointsInfo.point ? TripFormView.parsePointToState(pointsInfo.point) : TripFormView.parsePointToState(POINT_EMPTY));
    this.#tripOffers = pointsInfo.tripOffers;
    this.#tripDestinations = pointsInfo.tripDestinations;
    this.#onHideClick = onHideClick;
    this.#onFormSubmit = onFormSubmit;

    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#hideClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#onTypeChange);
    this.element.querySelector('[name="event-destination"]').addEventListener('change', this.#onDestinationChange);
  }

  get template() {
    return createTripFormEditTemplate(
      this._state,
      this.#tripOffers,
      this.#tripDestinations
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(TripFormView.parseStateToPoint(this._state));
  };

  #hideClickHandler = (evt) => {
    evt.preventDefault();
    this.#onHideClick();
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
    const getDestinationbyName = this.#tripDestinations.find((destination) => destination.name === selectedDestination.trim()).id;

    this.updateElement({
      destination: getDestinationbyName
    });
  };

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }
}
