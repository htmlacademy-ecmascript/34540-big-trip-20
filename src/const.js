const POINT_COUNT = 10;

const POINT_EMPTY = {
  id: null,
  type: 'taxi',
  dateFrom: '',
  dateTo: '',
  destination: '',
  basePrice: 0,
  isFavorite: true,
  offers: []
};

const DATE_FORMAT = {
  dateTime: 'MM/DD/YY HH:mm',
  dateShort: 'MMM D',
  dateFull: 'YYYY-MM-DD',
  time: 'HH:mm'
};

export {
  POINT_COUNT,
  DATE_FORMAT,
  POINT_EMPTY
};
