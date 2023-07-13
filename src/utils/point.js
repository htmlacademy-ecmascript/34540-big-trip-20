import dayjs from 'dayjs';

const isPointFuture = (point) => dayjs().isBefore(point.dateFrom);

const isPointPresent = (point) => (dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo));

const isPointPast = (point) => dayjs().isAfter(point.dateTo);

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortPointDay = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export {
  isPointFuture,
  isPointPresent,
  isPointPast,
  sortPointDay,
  sortPointPrice
};
