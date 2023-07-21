import dayjs from 'dayjs';

const isPointFuture = (point) => dayjs().isBefore(point.dateFrom);

const isPointPresent = (point) => (dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo));

const isPointPast = (point) => dayjs().isAfter(point.dateTo);

const getWeightForNullDate = (dateA, dateB) => {
  if (!dateA && !dateB) {
    return 0;
  }

  if (!dateA) {
    return 1;
  }

  if (!dateB) {
    return -1;
  }

  return null;
};

const sortPointDay = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

const sortPointTime = (pointA, pointB) => {
  const pointATimeDifference = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const pointBTimeDifference = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return pointBTimeDifference - pointATimeDifference;
};

const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const getOffersByType = (type, offers) => offers.find((offer) => offer.type === type).offers;

export {
  isPointFuture,
  isPointPresent,
  isPointPast,
  sortPointDay,
  sortPointTime,
  sortPointPrice,
  getOffersByType
};
