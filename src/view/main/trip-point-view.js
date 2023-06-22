import AbstractView from '../../framework/view/abstract-view.js';
import {humanizeDate} from '../../utils.js';
import {DateFormat, ETime} from '../../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const createTripPointOffersTemplate = (pointOffers) => (
  `<h4 class="visually-hidden">Offers:</h4>

    ${pointOffers.length > 1 ? `<ul class="event__selected-offers">
        ${pointOffers.map(({title, price}) => `<li class="event__offer">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </li>`).join('')}
        </ul>` : ''}`
);

const createTripPointTemplate = (point, pointDestination, pointOffers) => {
  const {dateFrom, dateTo, basePrice, isFavorite, type} = point;
  const dateFromFull = humanizeDate(dateFrom, DateFormat.DATE_FULL);
  const dateFromShort = humanizeDate(dateFrom, DateFormat.DATE_SHORT);
  const dateToFull = humanizeDate(dateTo, DateFormat.DATE_FULL);
  const timeFrom = humanizeDate(dateFrom, DateFormat.TIME);
  const timeTo = humanizeDate(dateTo, DateFormat.TIME);

  const getTimeDifference = () => {
    const timeDifference = dayjs(dateTo).diff(dayjs(dateFrom)); // in milliseconds
    let pointDuration = 0;

    switch (true) {
      case (timeDifference < ETime.MsInHour): // < 1 hour
        pointDuration = dayjs.duration(timeDifference).format('mm[M]');
        break;
      case (timeDifference >= ETime.MsInHour): // >= 1 hour
        pointDuration = dayjs.duration(timeDifference).format('HH[H] mm[M]');
        break;
      case (timeDifference >= ETime.MsInDay): // >= 1 day
        pointDuration = dayjs.duration(timeDifference).format('DD[D] HH[H] mm[M]');
        break;
    }

    return pointDuration;
  };

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  const pointOffersData = createTripPointOffersTemplate(pointOffers);

  return (
    `<div class="event">
      <time class="event__date" datetime="${dateFromFull}">${dateFromShort}</time>
      <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type}">
      </div>
      <h3 class="event__title">${pointDestination.name}</h3>
      <div class="event__schedule">
          <p class="event__time">
              <time class="event__start-time" datetime="${dateFromFull}T${timeFrom}">${timeFrom}</time>
              &mdash;
              <time class="event__end-time" datetime="${dateToFull}T${timeTo}">${timeTo}</time>
          </p>
          <p class="event__duration">${getTimeDifference()}</p>
      </div>
      <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      ${pointOffersData}
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
      </button>
      <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
      </button>
  </div>`
  );
};

export default class TripPointView extends AbstractView {
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #handleEditClick = null;

  constructor({pointInfo, onEditClick}) {
    super();
    this.#point = pointInfo.point;
    this.#pointDestination = pointInfo.pointDestination;
    this.#pointOffers = pointInfo.pointOffers;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createTripPointTemplate(
      this.#point,
      this.#pointDestination,
      this.#pointOffers
    );
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
