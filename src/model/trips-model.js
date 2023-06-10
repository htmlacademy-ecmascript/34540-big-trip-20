import {getRandomPoint} from '../mock/points.js';
import {getOffers} from '../mock/offers.js';
import {POINT_COUNT} from '../const.js';

export default class TripsModel {
  tasks = Array.from({length: POINT_COUNT}, getRandomPoint);
  offers = getOffers();

  getPoints() {
    return this.tasks;
  }

  getOffers() {
    return this.offers;
  }
}
