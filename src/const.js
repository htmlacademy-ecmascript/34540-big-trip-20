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

const ETime = {
  MsInHour: 60 * 60 * 1000,
  MsInDay: 60 * 60 * 1000 * 24,
};

export {
  POINT_COUNT,
  POINT_EMPTY,
  DateFormat,
  ETime
};
