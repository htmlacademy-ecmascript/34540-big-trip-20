import {createElement} from '../../render.js';
import {humanizeDate} from '../../utils.js';
import {DATE_FORMAT} from '../../const.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const createTripPointOffersTemplate = (offers) => (
  `<h4 class="visually-hidden">Offers:</h4>

    ${offers.length > 1 ? `<ul class="event__selected-offers">
        ${offers.map(({title, price}) => `<li class="event__offer">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </li>`).join('')}
        </ul>` : ''}`
);

const createTripPointTemplate = (point, destination, offers) => {
  const {dateFrom, dateTo, basePrice, isFavorite, type} = point;
  const dateFromFull = humanizeDate(dateFrom, DATE_FORMAT.dateFull);
  const dateFromShort = humanizeDate(dateFrom, DATE_FORMAT.dateShort);
  const dateToFull = humanizeDate(dateTo, DATE_FORMAT.dateFull);
  const timeFrom = humanizeDate(dateFrom, DATE_FORMAT.time);
  const timeTo = humanizeDate(dateTo, DATE_FORMAT.time);

  const getTimeDifference = () => {
    const timeDifference = dayjs(dateTo).diff(dayjs(dateFrom)); // in milliseconds
    let pointDuration = 0;

    switch (true) {
      case (timeDifference < 60 * 60 * 1000): // < 1 hour
        pointDuration = dayjs.duration(timeDifference).format('mm[M]');
        break;
      case (timeDifference >= 60 * 60 * 1000): // >= 1 hour
        pointDuration = dayjs.duration(timeDifference).format('HH[H] mm[M]');
        break;
      case (timeDifference >= 60 * 60 * 1000 * 24): // >= 1 day
        pointDuration = dayjs.duration(timeDifference).format('DD[D] HH[H] mm[M]');
        break;
    }

    return pointDuration;
  };

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  const pointOffers = createTripPointOffersTemplate(offers);

  return (
    `<div class="event">
      <time class="event__date" datetime="${dateFromFull}">${dateFromShort}</time>
      <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type}">
      </div>
      <h3 class="event__title">${destination.name}</h3>
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
      ${pointOffers}
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

export default class TripPointView {
  constructor({point, destination, offers}) {
    this.point = point;
    this.destination = destination;
    this.offers = offers;
  }

  getTemplate() {
    //console.log(this.destination);
    return createTripPointTemplate(this.point, this.destination, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
