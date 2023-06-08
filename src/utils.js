import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomInt = (max) => Math.floor(Math.random() * max);

const humanizeDate = (date, dateFormat = 'MMM D') => date ? dayjs(date).format(dateFormat) : '';

export {getRandomArrayElement, getRandomInt, humanizeDate};
