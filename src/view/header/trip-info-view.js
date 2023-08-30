import AbstractView from '../../framework/view/abstract-view.js';

const createTripInfoTemplate = (tripRouteTitle, tripRouteDates, tripTotalPrice) => (
  `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
            <h1 class="trip-info__title">${tripRouteTitle}</h1>
            <p class="trip-info__dates">${tripRouteDates}</p>
        </div>

        <p class="trip-info__cost">Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripTotalPrice}</span></p>
    </section>`
);

export default class TripInfoView extends AbstractView {
  #tripRouteTitle = '';
  #tripRouteDates = '';
  #tripTotalPrice = 0;

  constructor({tripRouteTitle, tripRouteDates, tripTotalPrice}) {
    super();
    this.#tripRouteTitle = tripRouteTitle;
    this.#tripRouteDates = tripRouteDates;
    this.#tripTotalPrice = tripTotalPrice;
  }

  get template() {
    return createTripInfoTemplate(this.#tripRouteTitle, this.#tripRouteDates, this.#tripTotalPrice);
  }
}
