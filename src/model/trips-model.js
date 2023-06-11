import {getRandomPoint} from '../mock/points.js';
import {generateDestinations} from '../mock/destinations.js';
import {generateOffers} from '../mock/offers.js';
import {POINT_COUNT} from '../const.js';

export default class TripsModel {
  points = Array.from({length: POINT_COUNT}, getRandomPoint);
  destinations = generateDestinations();
  offers = generateOffers();

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getOffersById(type, offerIds) {
    const offersByType = this.offers.find((offer) => offer.type === type).offers;

    return offerIds.map((offerId) => offersByType.find((offer) => offer.id === offerId));
  }

  getDestinations() {
    return this.destinations;
  }

  getDestinationById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }
}
