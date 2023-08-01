import AbstractView from '../../framework/view/abstract-view.js';
import {NoPointsTextType} from '../../const.js';

const createTripListEmptyTemplate = (filterType) => {
  const noPointTextValue = NoPointsTextType[filterType];

  return `<p class="trip-events__msg">${noPointTextValue}</p>`;
};

export default class TripListEmptyView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createTripListEmptyTemplate(this.#filterType);
  }
}
