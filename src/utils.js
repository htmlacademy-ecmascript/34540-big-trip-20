import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const humanizeDate = (date, dateFormat = 'MMM D') => date ? dayjs(date).format(dateFormat) : '';

const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

export {getRandomArrayElement, humanizeDate, capitalizeFirstLetter};
