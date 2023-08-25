import Observable from '../framework/observable.js';
import {getPoints} from '../mock/points.js';
import {generateDestinations} from '../mock/destinations.js';
import {generateOffers} from '../mock/offers.js';
import {POINT_COUNT} from '../const.js';

export default class TripModel extends Observable {
  #tripApiService = null;

  #points = getPoints().length ? this.#generatePoints() : [];
  #destinations = generateDestinations();
  #offers = generateOffers();

  constructor({tripApiService}) {
    super();
    this.#tripApiService = tripApiService;

    this.#tripApiService.points.then((points) => {
      console.log(points);
      console.log(points.map(this.#adaptToClient));
    });
  }

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

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      basePrice: point['base_price'],
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['basePrice'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
