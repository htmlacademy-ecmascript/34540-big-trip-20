import dayjs from 'dayjs';

const isPointFuture = (point) => dayjs().isBefore(point.dateFrom);

const isPointPresent = (point) => (dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo));

const isPointPast = (point) => dayjs().isAfter(point.dateTo);

export {
  isPointFuture,
  isPointPresent,
  isPointPast
};
