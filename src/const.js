const POINT_COUNT = 10;

const POINT_EMPTY = {
  id: null,
  type: 'taxi',
  dateFrom: '',
  dateTo: '',
  destination: '',
  basePrice: 0,
  isFavorite: null,
  offers: []
};

const DateFormat = {
  DATE_TIME: 'MM/DD/YY HH:mm',
  DATE_SHORT: 'MMM D',
  DATE_FULL: 'YYYY-MM-DD',
  TIME: 'HH:mm'
};

const TimeCalc = {
  MS_IN_HOUR: 60 * 60 * 1000,
  MS_IN_DAY: 60 * 60 * 1000 * 24,
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};


export {
  POINT_COUNT,
  POINT_EMPTY,
  DateFormat,
  TimeCalc,
  FilterType,
  SortType,
  NoPointsTextType,
  UserAction,
  UpdateType
};
