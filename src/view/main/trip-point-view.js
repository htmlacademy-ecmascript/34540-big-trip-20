import {createElement} from '../../render.js';
import {humanizeDate} from '../../utils.js';
import {DATE_FORMAT} from '../../const.js';
import dayjs from 'dayjs';

const createTripPointOffersTemplate = (offers) => (
  `<h4 class="visually-hidden">Offers:</h4>

    ${offers.length > 1 ? `<ul class="event__selected-offers">

        ${offers.map((offer) => `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
</li>`).join('')}

        </ul>` : ''}`
);

const createTripPointTemplate = (point) => {
  const {destination, dateFrom, dateTo, basePrice, isFavorite, offers, type} = point;
  const dateFromFull = humanizeDate(dateFrom, DATE_FORMAT.dateFull);
  const dateFromShort = humanizeDate(dateFrom, DATE_FORMAT.dateShort);
  const dateToFull = humanizeDate(dateTo, DATE_FORMAT.dateFull);
  const timeFrom = humanizeDate(dateFrom, DATE_FORMAT.time);
  const timeTo = humanizeDate(dateTo, DATE_FORMAT.time);

  const getTimeDifference = () => {
    let timeDifference = '';
    const from = dayjs(dateFrom);
    const to = dayjs(dateTo);
    const hoursDifference = to.diff(from, 'h');
    const minutesDifference = to.diff(from, 'minute');

    if (minutesDifference >= 60) {
      const finalMinutes = minutesDifference - hoursDifference * 60;
      timeDifference = finalMinutes > 0 ? `${hoursDifference}H ${finalMinutes}M` : `${hoursDifference}H`;
    } else {
      timeDifference = `${minutesDifference}M`;
    }

    return timeDifference;
  };

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  const pointOffers = createTripPointOffersTemplate(offers);

  return (
    `<div class="event">
    <time class="event__date" datetime="${dateFromFull}">${dateFromShort}</time>
    <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type}">
    </div>
    <h3 class="event__title">${destination}</h3>
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
  constructor({point}) {
    this.point = point;
  }

  getTemplate() {
    return createTripPointTemplate(this.point);
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
