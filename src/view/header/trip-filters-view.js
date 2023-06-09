import AbstractView from '../../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../../utils/common.js';

const createFilterItem = (filter) => (
  `<div class="trip-filters__filter">
      <input
        id="filter-${filter.type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.type}"
        ${(filter.hasPoints) ? '' : 'disabled'}
        />
      <label
      class="trip-filters__filter-label"
      for="filter-${filter.type}">
        ${capitalizeFirstLetter(filter.type)}
      </label>
    </div>`
);

const createTripFiltersTemplate = (filters) => (
  `<form class="trip-filters" action="#" method="get">
    ${filters.reduce((result, filter) => {
    result += createFilterItem(filter);
    return result;
  }, '')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class TripFiltersView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createTripFiltersTemplate(this.#filters);
  }
}
