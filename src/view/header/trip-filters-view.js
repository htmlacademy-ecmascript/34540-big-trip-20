import AbstractView from '../../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../../utils/common.js';

const createFilterItem = (filter, currentFilterType) => (
  `<div class="trip-filters__filter">
      <input
        id="filter-${filter.type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.type}"
        ${(filter.hasPoints) ? '' : 'disabled'}
        ${filter.type === currentFilterType ? 'checked' : ''}
        />
      <label
      class="trip-filters__filter-label"
      for="filter-${filter.type}">
        ${capitalizeFirstLetter(filter.type)}
      </label>
    </div>`
);

const createTripFiltersTemplate = (filters, currentFilterType) => (
  `<form class="trip-filters" action="#" method="get">
    ${filters.reduce((result, filter) => {
    result += createFilterItem(filter, currentFilterType);
    return result;
  }, '')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class TripFiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createTripFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
