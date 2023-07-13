import {getPoints} from '../mock/points.js';
import {generateDestinations} from '../mock/destinations.js';
import {generateOffers} from '../mock/offers.js';
import {POINT_COUNT} from '../const.js';

export default class TripsModel {
  #points = getPoints().length ? this.#generatePoints() : [];
  #destinations = generateDestinations();
  #offers = generateOffers();

  #generatePoints() {
    const points = getPoints().slice(0, POINT_COUNT);

    return points;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  getOffersById(type, offerIds) {
    const offersByType = this.#offers.find((offer) => offer.type === type).offers;

    return offerIds.map((offerId) => offersByType.find((offer) => offer.id === offerId));
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
