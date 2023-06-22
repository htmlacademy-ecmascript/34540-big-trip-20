import AbstractView from '../../framework/view/abstract-view.js';
import {capitalizeFirstLetter, humanizeDate} from '../../utils.js';
import {POINT_EMPTY, DateFormat} from '../../const.js';

const createTripFormTypesGroupTemplate = (tripOffers) => (
  `<fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>

        ${tripOffers.map(({type}) => `<div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input visually-hidden" type="radio"
                 name="event-type" value="${type}">
          <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
      </div>`).join('')}
   </fieldset>`
);

const createTripFormDestinationsListTemplate = (tripDestinations) => (
  `<datalist id="destination-list-1">
    ${tripDestinations.map(({name}) => (`<option value="${name}"></option>`)).join('')}
  </datalist>`
);

const createTripFormOffersListTemplate = (point, tripOffers) => {
  const offersByType = tripOffers.find((offer) => offer.type === point.type).offers;

  return (
    `${offersByType.length ? `<section class="event__section event__section--offers">
        <h3 class="event__section-title event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offersByType.map(({id, title, price}) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox visually-hidden" id="event-offer-${point.type}-1" type="checkbox" name="event-offer-${point.type}"
                ${point.offers.includes(id) ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-luggage-1">
                <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
            </label>
          </div>`).join('')}
        </div>
    </section>` : ''}`
  );
};

const createTripFormEditTemplate = (point, pointDestination, tripOffers, tripDestinations) => {
  const {type, basePrice} = point;
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

export default class TripFormView extends AbstractView {
  #point = null;
  #pointDestination = null;
  #tripOffers = null;
  #tripDestinations = null;
  #handleHideClick = null;
  #handleFormSubmit = null;

  constructor({pointInfo, onFormSubmit, onHideClick}) {
    super();
    this.#point = pointInfo.point ? pointInfo.point : POINT_EMPTY;
    this.#pointDestination = pointInfo.pointDestination ? pointInfo.pointDestination : POINT_EMPTY.destination;
    this.#tripOffers = pointInfo.tripOffers;
    this.#tripDestinations = pointInfo.tripDestinations;
    this.#handleHideClick = onHideClick;
    this.#handleFormSubmit = onFormSubmit;

    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#hideClickHandler);
  }

  get template() {
    return createTripFormEditTemplate(
      this.#point,
      this.#pointDestination,
      this.#tripOffers,
      this.#tripDestinations
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #hideClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleHideClick();
  };
}
